import { TypedString } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

class CustomModule implements CompilerPresetModule {

	public compile(typedString: TypedString): RouteAssembly {
		return {
			text: typedString,
			splitType: SplitType.None
		};
	}

}

export default new CustomModule();
