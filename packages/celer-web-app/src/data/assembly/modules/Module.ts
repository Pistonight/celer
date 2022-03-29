import { TypedString } from "../text/";
import { RouteAssembly } from "../types";

// modules are for recognizing step objects
export interface CompilerPresetModule {
    compile(typedString: TypedString): RouteAssembly | undefined;
}
