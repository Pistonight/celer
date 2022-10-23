import { useState } from "react";
import { View, Text } from "react-native";
import { HomePageColors, Sizes, Fonts } from "ui/styles";
import { LocalStorageWrapper, loadRecentPages } from "data/storage";
import { EmptyObject } from "data/util";

// Function that automatically populates the Recent Pages table
function populateRecentPages() {
	const recentPages = loadRecentPages();
	return recentPages.map((url) => {
		if (!url) {
			return;
		}
		const link = "#/" + url;
		return (
			<li key={url}>
				<a href={link}>
					{url}
				</a>
			</li>
		);
	});
}

export const Home: React.FC<EmptyObject> = () => {
	const [textBundle, setTextBundle] = useState(LocalStorageWrapper.load<string>("TmpBundleString", ""));
	const SITE_PADDING = "2em";
	const MIN_WIDTH_BEFORE_COLLAPSE = 325;

	return (
		<View style={{ backgroundColor: HomePageColors.background }}>
			<View style={{ flexDirection: "row", padding: SITE_PADDING }}>
				{/* TODO: it may be beneficial to have the link to the image as a constant variable */}
				{/* TODO: this way of doing the image causes it to stretch when using smaller screen sizes. Make it not do that.*/}
				<img src="celer.png" alt="Celer Logo" height='128' />
				<h1 style={{ color: HomePageColors.titleText, fontSize: Sizes.titleText }}>Celer Route Engine</h1>
			</View>
			<View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
				<View style={{ flex: 1, minWidth: MIN_WIDTH_BEFORE_COLLAPSE, flexDirection: "column" }}>
					<View style={{ paddingHorizontal: SITE_PADDING }}>
						<h2 style={{ color: HomePageColors.sectionTitleText, fontSize: Sizes.sectionTitleText }}>My Recent Routes</h2>
						{/* TODO: apply the RecentRoutesList styles to each list item */}
						<ul>
							{populateRecentPages()}
							<li><a href="#/dev">Dev Server</a></li>
						</ul>
					</View>
					<View style={{ paddingHorizontal: SITE_PADDING }}>
						<Text>If you have a route on GitHub, you can load it directly through the URL.</Text>
						<Text style={{ fontFamily: Fonts.codeBlockFamily, color: HomePageColors.codeBlock }}>https://celer.itntpiston.app/#/gh/[user]/[repo]</Text>
					</View>
				</View>
				<View style={{ flex: 1, minWidth: MIN_WIDTH_BEFORE_COLLAPSE, paddingHorizontal: SITE_PADDING }}>
					<h2 style={{ color: HomePageColors.sectionTitleText, fontSize: Sizes.sectionTitleText }}>Upload Route</h2>
					<Text>To upload a route, please paste the contents of your <span style={{ fontFamily: Fonts.codeBlockFamily, color: HomePageColors.codeBlock }}>bundle.json</span> file into the box or use the "Choose File" button and press "Upload Route" below.</Text>
					<textarea rows={10} cols={60} value={textBundle} onChange={(e) => {
						LocalStorageWrapper.store<string>("TmpBundleString", e.target.value);
						setTextBundle(e.target.value);
					}}></textarea>
					<br />
					<input type="file" onChange={(e) => {
						const files = e.target.files;
						if (files?.length && files[0]) {
							const file = files[0];
							file.text().then(text => {
								LocalStorageWrapper.store<string>("TmpBundleString", text);
								setTextBundle(text);
							});
						}
					}}></input>
					<br />
					<button type="button" id="upload-route-button">Upload Route</button>
				</View>
			</View>
		</View>
	);
};
