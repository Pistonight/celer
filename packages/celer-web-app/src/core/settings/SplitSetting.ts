import { SplitType } from "core/compiler";

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
