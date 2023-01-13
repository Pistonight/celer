import { useEffect, useState } from "react";

type Props = {
    error?: boolean
}

export const LoadingFrame: React.FC<Props> = ({error, children}) => {
	const [dots, setDots] = useState("");
	useEffect(()=>{
		const handle = setTimeout(()=>{
			if (dots.length > 20){
				setDots("");
			}else{
				setDots(dots+".");
			}
		}, 500);
		return ()=>{
			clearTimeout(handle);
		};
	}, [dots]);
	return (
		<div style={{
			height: "100vh",
			paddingTop: 300,
			textAlign: "center",
			color: error?"#ff8888":"#00ffcc",
			fontSize: 20,
			overflowY: "hidden",
			backgroundColor: "#262626"
		}}>
			<div>
				<img src={error?"./celer_error.png":"./celer.png"}></img>
			</div>
			<div style={{
				marginTop: 20
			}}>
				<p>
					{children}
				</p>
				<p>
					{!error && dots}
				</p>

			</div>
		</div>
	);
};
