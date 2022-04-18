const STORAGE_KEY_PREFIX = "Celer.";

export class LocalStorageWrapper {
	public static store<T>(key: string, value: T, customStringifier?: (item: T)=>string): void {
		const prefixedKey = STORAGE_KEY_PREFIX+key;
		if(customStringifier){
			localStorage.setItem(prefixedKey, customStringifier(value));
		}else{
			localStorage.setItem(prefixedKey, JSON.stringify(value));
		}
	}
	public static load<T>(key: string, defaultValue: T, customParser?: (valueString: string)=>T): T {
		const prefixedKey = STORAGE_KEY_PREFIX+key;
		const valueString = localStorage.getItem(prefixedKey);
		if(valueString === null){
			return defaultValue;
		}
		if(customParser){
			return customParser(valueString);
		}
		const valueObject = JSON.parse(valueString);
		return valueObject;
	}
	public static delete(key: string): void{
		const prefixedKey = STORAGE_KEY_PREFIX+key;
		localStorage.removeItem(prefixedKey);
	}
}
