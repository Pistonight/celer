export type Theme = {
	name: string,
	next: () => Theme
}

export const Themes: {[key: string]: Theme} =
{
	Default: {
		name: "Default",
		next: ()=>Themes.Granatus
	},
	Granatus: {
		name: "Granatus",
		next: ()=>Themes.Default
	},
};
