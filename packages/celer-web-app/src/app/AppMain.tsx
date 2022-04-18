import { AppFrame } from "ui/frames";
import { EmptyObject } from "data/util";
import { AppRouter } from "./AppRouter";

// The root component
export const AppMain: React.FC<EmptyObject> = ()=>
	<AppRouter>
		<AppFrame />
	</AppRouter>
;
