import { StringType, TypedString, TypedStringSingle } from "../text";
import { RouteAssembly, SplitType } from "../types";
import { CompilerPresetModule } from "./Module";

const PREFIX = "_Material<";
const SUFFIX = ">";

class MaterialModule implements CompilerPresetModule {

	public compile(typedString: TypedString): RouteAssembly | undefined {
		const name = typedString.toString();
		if(!name.startsWith(PREFIX) || !name.endsWith(SUFFIX)){
			return undefined;
		}
		const material =  name.substring(PREFIX.length, name.length-SUFFIX.length);
		const commaIndex = material.indexOf(",");
		if(commaIndex === -1){
			return {
				text: new TypedStringSingle({
					content: material,
					type: StringType.Item
				}),
				icon: "material",
				splitType: SplitType.None
			};
		}
		const materialDisplayName = material.substring(0, commaIndex).trim();
		const materialCount = Number(material.substring(commaIndex+1).trim()) || 0;
		const materialKey = materialDisplayName.replaceAll(" ", "");
		return {
			text: new TypedStringSingle({
				content: `${materialCount} ${materialDisplayName}`,
				type: StringType.Item
			}),
			comment: new TypedStringSingle({
				content: materialKey,
				type: StringType.Variable
			}),
			icon: "material",
			splitType: SplitType.None,
			variableChange: {
				[materialKey]: materialCount
			}
		};
	}
}

export default new MaterialModule();
