import { SplitType } from "core/compiler";
import { DocLine } from "core/engine";
import Icons from "data/image";
import { MapOf } from "data/util";

export const toLiveSplitEncodedImage = (webpackImageData: string):string => {
	if(!webpackImageData) {
		return "";
	}
    
	const imageBase64String = webpackImageData.substring(webpackImageData.indexOf(",")+1);
    
	const imageBase64Buff = Buffer.from(imageBase64String, "base64");

	const headerArray = [ 0x00, 0x01, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff,
		0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x02, 0x00, 0x00, 0x00, 0x51, 0x53, 0x79,
		0x73, 0x74, 0x65, 0x6d, 0x2e, 0x44, 0x72, 0x61, 0x77, 0x69, 0x6e, 0x67, 0x2c, 0x20, 0x56, 0x65, 0x72, 0x73,
		0x69, 0x6f, 0x6e, 0x3d, 0x34, 0x2e, 0x30, 0x2e, 0x30, 0x2e, 0x30, 0x2c, 0x20, 0x43, 0x75, 0x6c, 0x74, 0x75,
		0x72, 0x65, 0x3d, 0x6e, 0x65, 0x75, 0x74, 0x72, 0x61, 0x6c, 0x2c, 0x20, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x63,
		0x4b, 0x65, 0x79, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x3d, 0x62, 0x30, 0x33, 0x66, 0x35, 0x66, 0x37, 0x66, 0x31,
		0x31, 0x64, 0x35, 0x30, 0x61, 0x33, 0x61, 0x05, 0x01, 0x00, 0x00, 0x00, 0x15, 0x53, 0x79, 0x73, 0x74, 0x65,
		0x6d, 0x2e, 0x44, 0x72, 0x61, 0x77, 0x69, 0x6e, 0x67, 0x2e, 0x42, 0x69, 0x74, 0x6d, 0x61, 0x70, 0x01, 0x00,
		0x00, 0x00, 0x04, 0x44, 0x61, 0x74, 0x61, 0x07, 0x02, 0x02, 0x00, 0x00, 0x00, 0x09, 0x03, 0x00, 0x00, 0x00,
		0x0f, 0x03, 0x00, 0x00, 0x00, 0xcd, 0x0c, 0x00, 0x00, 0x02];

	const headerBuff = Buffer.from(headerArray);
	const footerBuff = Buffer.from([0x0b]);

	const livesplitEncodedBase64Buff = Buffer.concat([headerBuff, imageBase64Buff, footerBuff], imageBase64Buff.length + 162);

	const livesplitEncodedBase64String = livesplitEncodedBase64Buff.toString("base64");
	const cDataString = `<![CDATA[${livesplitEncodedBase64String}]]>`;

	return cDataString;
};

export const createLiveSplitFile = (lines: DocLine[], formatter: (variables: MapOf<number>, splitType: SplitType, lineText: string)=>string|undefined): string => {
	const header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Run version=\"1.7.0\"><GameIcon/><GameName/><CategoryName/><LayoutPath/><Metadata><Run id=\"\"/><Platform usesEmulator=\"False\"/><Region/><Variables /></Metadata><Offset>00:00:00</Offset><AttemptCount>0</AttemptCount><AttemptHistory/><Segments>";
	const footer = "</Segments><AutoSplitterSettings/></Run>";
	return `${header}${createSegmentTags(lines, formatter)}${footer}`;
};

const createSegmentTags = (lines: DocLine[], formatter: (variables: MapOf<number>, splitType: SplitType, lineText: string)=>string|undefined): string => {
	const splitNames: string[] = [];
	const splitIcons: string[] = [];
	lines.forEach((line)=>{
		if(line.lineType === "DocLineTextWithIcon"){
			const name = formatter(line.variables, line.splitType, line.text.toString());

			if(name){
				splitNames.push(name);
				splitIcons.push(Icons[line.icon || ""]);
			}

		}

	});
	return splitNames.map((name, i)=>createSegmentTag(name, splitIcons[i])).join("");
};

const createSegmentTag = (splitName: string, icon: string): string =>{
	const cData = toLiveSplitEncodedImage(icon);
	return `<Segment><Name>${splitName}</Name><Icon>${cData}</Icon><SplitTimes><SplitTime name="Personal Best" /></SplitTimes><BestSegmentTime /><SegmentHistory /></Segment>`;
};
