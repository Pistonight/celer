import { Params } from "react-router-dom";
import { SourceObject, wasmBundleFromGzip, wasmCleanBundleJson } from "data/libs";
import { makeJsonResource, makeUInt8Resource, NetworkResource } from "data/util";
import { DocumentUrl, DocumentUrlConfig } from "./DocumentUrl";
import { Document, DocumentResponse } from "./types";

// Remove with LoadDocFromRelease
export const createDocumentGitHub = ({user, repo, ref}: Params, enableGzip: boolean) => {
	const config: DocumentUrlConfig[] = [];
	if (enableGzip) {
		config.push({
			url: `https://raw.githubusercontent.com/${user}/${repo}/${ref ?? "main"}/bundle.json.gz`,
			path: `gh/${user}/${repo}${ref ? `/${ref}` : ""}`,
			type: "gzip"
		});
	}
	config.push({
		url: `https://raw.githubusercontent.com/${user}/${repo}/${ref ?? "main"}/bundle.json`,
		path: `gh/${user}/${repo}${ref ? `/${ref}` : ""}`,
		type: "json"
	});
	return new DocumentUrl(config);
};

const getRawContentUrl = (owner: string, repo: string, ref?: string) => `https://raw.githubusercontent.com/${owner}/${repo}/${ref ?? "main"}/bundle.json`;
const getLatestReleaseUrl = (owner: string, repo: string) => `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
const getReleaseUrl = (owner: string, repo: string, tag: string) => `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`;

type GitHubReleaseResponse = {
	assets: {
		name: string,
		browser_download_url: string
	}[]
};

export class DocumentGitHub implements Document {
	private owner: string;
	private repo: string;
	private ref?: string;
	private releaseTag?: string;

	private pendingResource: NetworkResource<unknown> | undefined;

	constructor(owner: string, repo: string, ref?: string, releaseTag?: string) {
		this.owner = owner;
		this.repo = repo;
		this.ref = ref;
		this.releaseTag = releaseTag;
	}

	async load(): Promise<DocumentResponse> {
		this.release();
		if (this.ref && this.releaseTag){
			const base = this.ref;
			const tag = this.releaseTag;
			try {
				return await this.loadFromRelease(base, tag);
			} catch (e) {
				console.error(e);
				return { error: "Unable to fetch route from release" };
			}
		}

		if (this.ref) {
			// Try latest release
			const base = this.ref;
			try {
				return await this.loadFromRelease(base);
			} catch (e) {
				console.error(e);
			}
			// Try raw file
			try {
				return await this.loadUrl(getRawContentUrl(this.owner, this.repo, this.ref));
			} catch (e) {
				console.error(e);
				return { error: "Unable to fetch route from repo" };
			}

		}

		// Try latest release + bundle.json as name
		try {
			return await this.loadFromRelease("bundle");
		} catch (e) {
			console.error(e);
		}

		// Try main branch + bundle.json as name
		try {
			return await this.loadUrl(getRawContentUrl(this.owner, this.repo));
		} catch (e) {
			console.error(e);
			return { error: "Unable to fetch route from repo" };
		}
	}

	// NOTE: this doesn't work. we need a server to proxy the request
	async loadFromRelease(base: string, tag?: string): Promise<DocumentResponse> {
		const url = tag ? getReleaseUrl(this.owner, this.repo, tag) : getLatestReleaseUrl(this.owner, this.repo);
		const releaseResource = makeJsonResource<GitHubReleaseResponse>(url);
		this.pendingResource = releaseResource;
		try {
			const releaseData = await releaseResource.request();
			this.pendingResource = undefined;
			const assetMap: {[name: string]: string} = {};
			releaseData.assets.forEach(asset => {
				assetMap[asset.name] = asset.browser_download_url;
			});

			const gzipName = `${base}.json.gz`;
			if (gzipName in assetMap) {
				const bundleResource = makeUInt8Resource(assetMap[gzipName]);
				this.pendingResource = bundleResource;
				try {
					const bundleGzip = await bundleResource.request();
					this.pendingResource = undefined;
					const doc = wasmBundleFromGzip(bundleGzip);
					if(doc){
						return { doc };
					}
					return { error: "Unable to parse gzip data" };
				} catch (e) {
					console.error(e);
					return { error: "Unable to fetch route from release" };
				}
			}

			const jsonName = `${base}.json`;
			if (jsonName in assetMap) {
				try {
					return await this.loadUrl(assetMap[jsonName]);
				} catch (e) {
					console.error(e);
					return { error: "Unable to fetch route from release" };
				}
			}

			return { error: `Unable to find route: ${base}` };
		} catch (e) {
			// If cannot fetch release, throw the error so we can try fetching from repo
			console.error(e);
			this.pendingResource = undefined;
			throw e;
		}
	}

	async loadUrl(url: string): Promise<DocumentResponse> {
		const bundleResource = makeJsonResource<SourceObject>(url);
		this.pendingResource = bundleResource;

		const bundle = await bundleResource.request();
		this.pendingResource = undefined;
		return { doc: wasmCleanBundleJson(bundle) };
	}

	release(): void {
		if (this.pendingResource){
			this.pendingResource.cancel();
		}
	}
	getPath(): string {
		return ""; // Remove with useExpUseNewRecentPath
	}

}

export const createDocumentGitHubNew = ({user, repo, ref, release}: Params) => {
	if (!user || !repo) {
		throw new Error("Invalid GitHub URL");
	}
	return new DocumentGitHub(user, repo, ref, release);
};
