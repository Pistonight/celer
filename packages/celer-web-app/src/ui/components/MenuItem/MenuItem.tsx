import clsx from "clsx";
import React from "react";
import { useStyles } from "ui/StyleContext";

export interface MenuItemProps {
    tooltip?: string;
    text: string;
    action: ()=>void;
}

export interface MenuItemWithValueProps extends MenuItemProps{
    value: string
}

export interface MenuItemSubmenurops{
    text: string;
    selected: boolean;
    hover: ()=>void;
}

export const MenuItem: React.FC<MenuItemProps> = ({tooltip, text, action})=>{
	const styles = useStyles();
	return <div title={tooltip} className={clsx(styles.menuItem, styles.menuItemClickable)} onClick={()=>{
		action();
	}}>{text}</div>;
};

export const MenuItemSubmenu = React.forwardRef<HTMLDivElement, MenuItemSubmenurops>(({text, selected, hover}, ref)=>{
	const styles = useStyles();
	return <div className={clsx(styles.menuItem, selected && styles.menuItemSelected)} ref={ref} onMouseEnter={()=>{
		hover();
	}} onClick={(e)=>{
		e.stopPropagation();
	}}>{text}</div>;
});

export const MenuItemWithValue: React.FC<MenuItemWithValueProps> = ({tooltip, text, value, action}) => {
	const styles = useStyles();
	return <div title={tooltip} className={clsx(styles.menuItem, styles.menuItemClickable)} onClick={(e)=>{
		action();
		e.stopPropagation();
	}}>
		{text}
		<div className={styles.menuItemValue}>
			{value}
		</div>
	</div>;
};
