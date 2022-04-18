import { SplitType } from "core/compiler";
import { SplitTypeSettingStorage } from "./Setting";

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

export const SplitSettingStorage = new SplitTypeSettingStorage<boolean>("SplitSetting", defaultSplitSetting);
