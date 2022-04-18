import { Coord, Movement, SplitType } from "core/compiler";
import { DocLine } from "core/engine";

// Takes computed lines and emittes icons and lines on the map

const AssistLineColor = "#ffffff";
const DefaultLineColor = "#3388ff";

export class MapEngine {

	private currentCoord: Coord = {x:0, z:0};
	private currentIconCoord: Coord = {x:0, z:0};
	private currentColor: string = DefaultLineColor;
	private currentVertices: Coord[] = [];

	public compute(route: DocLine[]): [MapIcon[], MapLine[]] {
		// Start from SOR
		const sorCoord = {
			x:-1132.61,z: 1917.72
		};
		this.currentCoord = sorCoord;
		this.currentIconCoord = sorCoord;
		this.currentColor = DefaultLineColor;
		this.currentVertices = [sorCoord];

		const icons: MapIcon[] = [];
		const lines: MapLine[] = [];
        
		icons.push({
			iconName: "sor",
			coord: sorCoord,
			type: SplitType.UserDefined,
		});

		route.forEach(l=>this.computeLine(l, icons, lines));
		this.endCurrentPathIfNeed(lines);
		return [icons, lines];
	}

	private computeLine(line: DocLine, outIcons: MapIcon[], outLines: MapLine[]): void {
		if(line.lineType === "DocLineBanner" || line.lineType === "DocLineSection") {
			return;
		}
		if(line.mapLineColor){
			this.endCurrentPathIfNeed(outLines);
			this.currentColor = line.mapLineColor;
		}
		const movements = line.movements;
		movements.forEach(m=>this.computeMovement(m, outLines));
		if(line.lineType === "DocLineTextWithIcon" && !line.hideIconOnMap){
			outIcons.push({
				coord: {...this.currentIconCoord},
				iconName: line.icon,
				type: line.splitType
			});
		}
	}

	private computeMovement(movement: Movement, outLines: MapLine[]): void {
		const { to, isWarp, isAway } = movement;
		if(isAway){
			outLines.push({
				color: AssistLineColor,
				vertices: [{...this.currentCoord}, to]
			});
			this.currentIconCoord = to;
		}else{
			if(isWarp){
				this.endCurrentPathIfNeed(outLines);
				this.currentVertices = [to];
			}else{
				this.currentVertices.push(to);
			}
			this.currentCoord = to;
			this.currentIconCoord = to;
		}
	}

	private endCurrentPathIfNeed(outLines: MapLine[]): void {
		if(this.currentVertices.length>1){
			outLines.push({
				color: this.currentColor,
				vertices: [...this.currentVertices]
			});
			this.currentVertices = [this.currentVertices[this.currentVertices.length-1]];
		}
	}
}

export type MapIcon = {
    iconName: string,
    coord: Coord,
    type: SplitType
}

export type MapLine = {
    color: string,
    vertices: Coord[]
}
