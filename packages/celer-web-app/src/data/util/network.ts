import axios from "axios";

// Interface for a network resource of type T
export interface NetworkResource<T> {
    // Request the resource
    request(): Promise<T>;
    // Cancel the request
    cancel(): void
}

export const makeJsonResource = <T>(url: string): NetworkResource<T> => {
	const controller = new AbortController();
	const request = async () => {
		const {data} = await axios.get<T>(url, {
			signal: controller.signal
		});
		return data;
	};

	const cancel = () => controller.abort();
	return { request, cancel };
};

export const makeUInt8Resource = (url: string): NetworkResource<Uint8Array> => {
	const controller = new AbortController();
	const request = async () => {
		const {data} = await axios.get<ArrayBuffer>(url, {
			responseType: "arraybuffer", // This will make axios return data as ArrayBuffer
			signal: controller.signal
		});
		return new Uint8Array(data);
	};

	const cancel = () => controller.abort();
	return { request, cancel };
};
