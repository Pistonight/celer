import React from "react";
import ReactDOM from "react-dom";
import { AppMain } from "app/AppMain";
// Clean up when PigeonMap is enabled
/*import-validation-exempt*/import "data/libs/scripts";
import "./index.css";

ReactDOM.render(
	<React.StrictMode>
		<AppMain />
	</React.StrictMode>,
	document.getElementById("root")
);
