import { ComputeStyleInputs } from "ui/styles";

export const DocFrameStyle = ({sizes}: ComputeStyleInputs)=><const>{
	docFrame: {
		float: "left",
		overflowY: "auto",
		overflowX: "hidden",
		width: `calc( 100% - ${sizes.map} )`,
		height: `calc( 100vh - ${sizes.statusBar} )`
	}
};
