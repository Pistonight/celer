export const RECENTPAGES_KEY = "RecentlyVisitedPages";
export const NUM_RECENTPAGES = 5;

// Used when reading in the most recently visited websites from local storage
export function parseArrayFromString(valueString: string): string[] {
    const arrSize = NUM_RECENTPAGES;
    let returnArr = new Array(arrSize);
    const currentStorage = valueString.split(" ");
    let i=0;
    for (; i<currentStorage.length; i++) {
        returnArr[i] = currentStorage[i];
    }
    for (; i<arrSize; i++) {
        returnArr[i] = "";
    }
    return returnArr;
}

export function parseStringFromArray(valueArray: string[]): string {
    const returnString = valueArray.join(" ");
    return returnString;
}