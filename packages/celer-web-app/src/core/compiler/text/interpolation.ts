import { MapOf } from "data/util";
import { tokenize } from "./tokenize";

type Part = {
    content: string,
    isVariable: boolean,
    fillChar?: string,
    fieldWidth?: number,
}

// Return a function that can be used to format the format string passed in
export const getInterpolationFunction = (format: string): (variables: MapOf<number|string>)=>string => {
	const tokens = tokenize(format, /[{}]/);
	const parts: Part[] = [];
	let current = "";
	let i = 0;

	while(i<tokens.length){
		if (i+4 < tokens.length) {
			if (tokens[i] === "{" &&
            tokens[i+1] === "{" &&
            tokens[i+3] === "}" &&
            tokens[i+4] === "}"){
				if (tokens[i+2] !== "{" && tokens[i+2] !== "}"){
					if (current !== ""){
						parts.push({
							content: current,
							isVariable: false
						});
						current = "";
					}
					const raw = tokens[i+2];
					if (raw.startsWith("%")) {
						const splitIndex = raw.indexOf(" ");
						if(splitIndex > 0){
							const fieldFormat = raw.substring(1, splitIndex);
							const varName = raw.substring(splitIndex+1);
							if(fieldFormat.length>1){
								const fillChar = fieldFormat[0];
								const fieldWidth = parseInt(fieldFormat.substring(1));
								parts.push({
									content: varName,
									fillChar,
									fieldWidth,
									isVariable: true
								});
							}else{
								parts.push({
									content: varName,
									isVariable: true
								});
							}
						}else{
							parts.push({
								content: raw,
								isVariable: true
							});
						}
					}else{
						parts.push({
							content: raw,
							isVariable: true
						});
					}
                    
					i = i+5;
					continue;
				}
			}
		}
        
		if (i+8 < tokens.length){
			if (tokens[i] === "{" &&
            tokens[i+1] === "{" &&
            tokens[i+2] === "{" &&
            tokens[i+3] === "{" &&
            tokens[i+5] === "}" &&
            tokens[i+6] === "}" &&
            tokens[i+7] === "}" &&
            tokens[i+8] === "}"){
				if (tokens[i+4] !== "{" && tokens[i+4] !== "}"){
					if (current !== ""){
						parts.push({
							content: current,
							isVariable: false
						});
						current = "";
					}
                    
					parts.push({
						content: `{{{{${tokens[i+4]}}}}}`,
						isVariable: false
					});
					i = i+9;
					continue;
				}
                        
			}
                     
		}
          
		current+=tokens[i];
		i++;
	}
	if (current !== ""){
		parts.push({
			content: current,
			isVariable: false
		});
	}
    
	return (variables) => {
		return parts.map(({content, fillChar, fieldWidth, isVariable})=>{
			if(isVariable){
				let contentString = String(variables[content]);
				if(fillChar && fieldWidth){
					if(contentString.length<fieldWidth){
						contentString = fillChar.repeat(fieldWidth-contentString.length)+contentString;
					}
					if(contentString.length>fieldWidth){
						contentString = contentString.substring(contentString.length-fieldWidth);
					}
				}
				return contentString;
			}
			return content;
		}).filter(x=>x).join("");
	};

};
