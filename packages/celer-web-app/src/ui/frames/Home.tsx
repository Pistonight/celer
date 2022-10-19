import { useState } from "react";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";
import { HomePageColors, Sizes, Fonts } from "ui/styles";
import { View, Text, Image } from "react-native";
export const Home: React.FC<EmptyObject> = () => {
	const [textBundle, setTextBundle] = useState(LocalStorageWrapper.load<string>("TmpBundleString", ""));

	return (
		<View style={{backgroundColor: HomePageColors.background}}>
			<View nativeID="View-title" style={{flexDirection: "row"}}>
				{/* TODO: it may be beneficial to have the link to the image as a variable */}
				{/* TODO: this way of doing the image causes it to stretch when using smaller screen sizes. Make it not do that.*/ }
				<img src="../celer.png" alt="Celer Logo" />
				<h1 style={{color: HomePageColors.titleText, fontSize: Sizes.titleText}}>Celer Route Engine</h1>
			</View>
			<View style={{flexDirection: "row", justifyContent: "center", flexWrap: "wrap"}}>
				<View style={{flex: 1, minWidth: 300,flexDirection: "column"}}>
					<View nativeID="recent-routes">
						<h2 style={{color: HomePageColors.sectionTitleText, fontSize: Sizes.sectionTitleText}}>My Recent Routes</h2>
						{/* TODO: apply the RecentRoutesList styles to each list item */}
						<ul>
							<li><a href="#/dev">Dev Server</a></li>
						</ul>
					</View>
					<View nativeID="gh-route-info">
						<Text>If you have a route on GitHub, you can load it directly through the URL.</Text>
						<Text style={{fontFamily: Fonts.codeBlockFamily, color: HomePageColors.codeBlock}}>https://celer.itntpiston.app/#/gh/[user]/[repo]</Text>
					</View>
				</View>
				<View nativeID="upload-route" style = {{flex: 1, minWidth: 300}}>
					<h2 style={{color: HomePageColors.sectionTitleText, fontSize: Sizes.sectionTitleText}}>Upload Route</h2>
					<Text>To upload a route, please paste the contents of your <span style={{fontFamily: Fonts.codeBlockFamily, color: HomePageColors.codeBlock}}>bundle.json</span> file into the box and press "Submit" or use the "Upload Route" button below.</Text>
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
