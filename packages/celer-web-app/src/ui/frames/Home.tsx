import { useState } from "react";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";
import { HomePageColors, Sizes, Fonts } from "ui/styles";

export const Home: React.FC<EmptyObject> = () => {
	const [textBundle, setTextBundle] = useState(LocalStorageWrapper.load<string>("TmpBundleString", ""));

	return (
		<div style={{backgroundColor: HomePageColors.background}}>
			{/* TODO: arrange title and logo side-by-side */}
			<div id="div-title">
				{/* TODO: it may be beneficial to have the link to the image as a variable */}
				<img src="../celer.png" alt="Celer Logo"/>
				<h1 style={{color: HomePageColors.titleText, fontSize: Sizes.titleText}}>Celer Route Engine</h1>
			</div>
			<div id="recent-routes">
				<h2 style={{color: HomePageColors.sectionTitleText, fontSize: Sizes.sectionTitleText}}>My Recent Routes</h2>
				{/* TODO: apply the RecentRoutesList styles to each list item */}
				<ul>
					<li><a href="#/dev">Dev Server</a></li>
				</ul>
			</div>
			<div id="upload-route">
				<h2 style={{color: HomePageColors.sectionTitleText, fontSize: Sizes.sectionTitleText}}>Upload Route</h2>
				<p>To upload a route, please paste the contents of your <span style={{fontFamily: Fonts.codeBlockFamily, color: HomePageColors.codeBlock}}>bundle.json</span> file into the box and press "Submit" or use the "Upload Route" button below.</p>
				<textarea rows={10} cols={60} value={textBundle} onChange={(e)=>{
					LocalStorageWrapper.store<string>("TmpBundleString",e.target.value);
					setTextBundle(e.target.value);
				}}></textarea>
				<br/>
				<input type="file" onChange={(e)=>{
					const files = e.target.files;
					if(files?.length && files[0]){
						const file = files[0];
						file.text().then(text=>{
							LocalStorageWrapper.store<string>("TmpBundleString",text);
							setTextBundle(text);
						});
					}
				}}></input>
				<br/>
				<button type="button" id="upload-route-button">Upload Route</button>
			</div>
			<div id="gh-route-info">
				<p>If you have a route on GitHub, you can load it directly through the URL.</p>
				<p style={{fontFamily: Fonts.codeBlockFamily, color: HomePageColors.codeBlock}}>https://celer.itntpiston.app/#/gh/[user]/[repo]</p>
			</div>
		</div>
	);
};
