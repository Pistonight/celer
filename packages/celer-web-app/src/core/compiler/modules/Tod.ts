import { StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

class TodModule implements CompilerPresetModule {

	public compile(typedString: TypedString): RouteAssembly | undefined {
		const name = typedString.toString();
		if(name === "_Tod::Morning"){
			return {
				text: new TypedStringSingle({
					content: "Make Morning",
					type: StringType.Normal
				}),
				icon: "make-morning",
				splitType: SplitType.None
			};
		}else if(name === "_Tod::Noon"){
			return {
				text: new TypedStringSingle({
					content: "Make Noon",
					type: StringType.Normal
				}),
				icon: "make-noon",
				splitType: SplitType.None
			};
		}else if(name === "_Tod::Night"){
			return {
				text: new TypedStringSingle({
					content: "Make Night",
					type: StringType.Normal
				}),
				icon: "make-night",
				splitType: SplitType.None
			};
		}else{
			return undefined;
		}

	}
}

export default new TodModule();
