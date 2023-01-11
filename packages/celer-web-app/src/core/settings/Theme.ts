export const Themes = {
	Default: {
		name: "Default",
		next: ()=>Themes.Granatus
	},
	Granatus: {
		name: "Granatus",
		next: ()=>Themes.Default
	},
};

export const getNextTheme = (name: string) =>
{
	if (name == "Default")
	{
		return Themes.Default;
	}
	return Themes.Granatus;
};