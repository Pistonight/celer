import { useState } from "react";
import { LocalStorageWrapper } from "data/storage";
import { EmptyObject } from "data/util";

export const Home: React.FC<EmptyObject> = () => {
	const [textBundle, setTextBundle] = useState(LocalStorageWrapper.load<string>("TmpBundleString", ""));
    
	return (
		<div>
			<h1>
                            Home page is working in progress.
			</h1> 
			<p>
                            If you are using the python dev server, click <a href="#/pydev">here</a>
			</p>
			<p>
                            If you are using the new celer dev server, click <a href="#/dev">here</a>
			</p>
			<p>
                            If you are trying to view the route, open the route URL directly. Currently only routes on github are supported. use #/gh/:user/:repo or #/gh/:user/:repo/:branch
			</p>
			<hr />
			<p>
							Paste the content of bundle.json below or 
                            upload to view it <input type="file" onChange={(e)=>{
					const files = e.target.files;
					if(files?.length && files[0]){
						const file = files[0];
						file.text().then(text=>{
							LocalStorageWrapper.store<string>("TmpBundleString",text);
							setTextBundle(text);
						});
					}
				}}></input>
			</p>
			<textarea rows={10} cols={60} value={textBundle} onChange={(e)=>{
				LocalStorageWrapper.store<string>("TmpBundleString",e.target.value);
				setTextBundle(e.target.value);
			}}></textarea>
			{textBundle && <a href="#/local">View</a>}
		</div>
	);
};
