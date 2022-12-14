import { ComputeStyleInputs } from "ui/styles";

export const MenuFrameStyle = ({colors}: ComputeStyleInputs)=><const>{
	menuOverlayFrame:{
        position: "fixed", 
        top: 0, 
        left: 0,
        backgroundColor: "#00000055",
        width: "100vw",
        height: "100vh",
        zIndex: 999
    },
    contribution: {
        position: "absolute",
        bottom: 0,
        left: 0,
        padding: "5px", 
        fontSize: "10pt",
        color: colors.subText
    },
};
