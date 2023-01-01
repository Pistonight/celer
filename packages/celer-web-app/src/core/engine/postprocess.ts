import { inGameCoord } from "core/map";
import { DocLine } from "./RouteDocLine";

export const postProcessLines = (lines: DocLine[]): DocLine[] => {
    const sorCoord = inGameCoord(-1132.61, 1917.72);
    
    // add centerCoord to every text line
    // if the line has an icon but no movement, the coord should follow the previous line since that's where the icon is shown
    // otherwise if the line has no icon and no movement, follow the next line since that's where you want to go
        
    // adds centerCoord to text lines
    let center = sorCoord; // default to SOR
    for(let i=lines.length-1;i>=0;i--){
        const line = lines[i];
        if(line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon"){
            if(line.movements.length > 0){
                const {x,z} = line.movements[0].to;
                center = inGameCoord(x,z);
            }
            if(line.lineType === "DocLineText"){
                line.centerCoord = center;
            }
        }
    }
        
    // adds centerCoord to icon lines
    center = sorCoord; // default to SOR
    for(let i=0;i<lines.length;i++){
        const line = lines[i];
        if(line.lineType === "DocLineText" || line.lineType === "DocLineTextWithIcon"){
            if(line.movements.length > 0){
                const {x,z} = line.movements[0].to;
                center = inGameCoord(x,z);
            }
            if(line.lineType === "DocLineTextWithIcon"){
                line.centerCoord = center;
            }
        }
    }
    return lines;

}
