export class RecentPages {
    static KEY = "RecentlyVisitedPages";
    static NUM_PAGES = 5;
    static DEFAULT = new Array(RecentPages.NUM_PAGES);
    public static parseArrayFromString(valueString: string): string[] {
        const arrSize = RecentPages.NUM_PAGES;
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

    public static parseStringFromArray(valueArray: string[]): string {
        const returnString = valueArray.join(" ");
        return returnString;
    }
}