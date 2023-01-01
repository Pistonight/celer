import { ComputeStyleInputs } from "ui/styles";

export const MapFrameStyle = ({sizes}: ComputeStyleInputs)=><const>{
	mapFrame: {
		display: sizes.map === "0px" ? "none" : "block",
		width: sizes.map,
		height: "100vh",
		float: "right" ,
		boxSizing: "border-box",
		overflow: "hidden",
		backgroundColor: "#000000"
	},
};
