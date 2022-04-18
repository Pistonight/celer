import { useStyles } from "ui/StyleContext";
import { StringType, TypedString } from "core/compiler";
import { MapOf } from "data/util";

export interface TypedStringComponentProps {
    content: TypedString;
    variables: MapOf<number>;
    isNotes: boolean;
}
export const TypedStringComponent: React.FC<TypedStringComponentProps> = ({isNotes, content, variables})=>{
	let i = 0;
	return <>
		{content.map(({content, type})=>
			<TypeStringRender key={i++} content={content} type={type} variables={variables} isNotes={isNotes}/>
		)}
	</>;
};

interface TypedStringRenderProps {
    isNotes: boolean,
    content: string,
    type: StringType,
    variables: MapOf<number>;
}

const TypeStringRender: React.FC<TypedStringRenderProps> = ({isNotes, content, type, variables})=>{
	const styles = useStyles();
	if(type === StringType.Variable){
		return (
			<span className={isNotes ? styles.stringVariableColorNotes : styles.stringVariableColor}>
				{variables[content] || 0}
			</span>
		);
	}
	if(type === StringType.Link){
		let linkAddress = content;
		let linkText = content;
		if(content.startsWith("[")){
			const i = content.indexOf("]");
			if(i !== -1){
				linkText = content.substring(1, i);
				linkAddress = content.substring(i+1);
			}
		}
		return (
			<span>
				<a className={isNotes ? styles.stringLinkColorNotes : styles.stringLinkColor} href={linkAddress} target="_blank" rel="noreferrer">
					{linkText}
				</a>
			</span>
		);
	}
	if(type === StringType.Code){
		return <span className="code" >{content}</span>;
	}
	//TODO direction mode
	if(type === StringType.Direction){
		return <span className={isNotes ? styles.stringDirectionColorNotes : styles.stringDirectionColor} >{content}</span>;
	}
	let className = "";
	switch(type){
		case StringType.Item:
			className = isNotes ? styles.stringItemColorNotes : styles.stringItemColor;
			break;
		case StringType.Location:
			className = isNotes ? styles.stringLocationColorNotes : styles.stringLocationColor;
			break;
		case StringType.Npc:
			className = isNotes ? styles.stringNpcColorNotes : styles.stringNpcColor;
			break;
		case StringType.Rune:
			className = isNotes ? styles.stringRuneColorNotes : styles.stringRuneColor;
			break;
		case StringType.Boss:
			className = isNotes ? styles.stringBossColorNotes : styles.stringBossColor;
			break;
		case StringType.Enemy:
			className = isNotes ? styles.stringEnemyColorNotes : styles.stringEnemyColor;
			break;
		case StringType.Important:
			className = isNotes ? styles.stringImportantColorNotes : styles.stringImportantColor;
			break;
		case StringType.Gale:
			className = isNotes ? styles.stringGaleColorNotes : styles.stringGaleColor;
			break;
		case StringType.Fury:
			className = isNotes ? styles.stringFuryColorNotes : styles.stringFuryColor;
			break;
	}
	return <span className={className}>{content}</span>;
};
