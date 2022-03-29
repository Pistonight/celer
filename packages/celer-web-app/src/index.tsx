import React from "react";
import ReactDOM from "react-dom";
import { AppFrame } from "ui/frames/AppFrame";
import { AppRoot } from "ui/root/AppRoot";
import { Experiments } from "ui/root/Experiments";
import "./index.css";

ReactDOM.render(
	<React.StrictMode>
		<Experiments overrides={{}}>
			<AppRoot>
				<AppFrame />
			</AppRoot>
		</Experiments>
	</React.StrictMode>,
	document.getElementById("root")
);
