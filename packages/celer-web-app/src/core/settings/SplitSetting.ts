import { SplitType } from "core/compiler";

export type splitSettings =
{
	[SplitType.None]: boolean,
	[SplitType.Tower]: boolean,
	[SplitType.Shrine]: boolean,
	[SplitType.Warp]: boolean,
	[SplitType.Memory]: boolean,
	[SplitType.Korok]: boolean,
	[SplitType.Hinox]: boolean,
	[SplitType.Talus]: boolean,
	[SplitType.Molduga]: boolean,
	[SplitType.UserDefined]: boolean
}

export const defaultSplitSetting = {
	[SplitType.None]: false,
	[SplitType.Tower]: true,
	[SplitType.Shrine]: true,
	[SplitType.Warp]: true,
	[SplitType.Memory]: true,
	[SplitType.Korok]: false,
	[SplitType.Hinox]: false,
	[SplitType.Talus]: false,
	[SplitType.Molduga]: false,
	[SplitType.UserDefined]: true
};
