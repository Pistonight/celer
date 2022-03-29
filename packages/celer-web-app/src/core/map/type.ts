import { Coord } from "data/assembly";

export interface MapSegment {
    targetCoord: Coord,
    targetIcon: string,
    iconSize: IconSize
}

export enum IconSize{
    Tiny = 16,
    Small = 24,
    Medium = 32,
    Big = 48,
    Huge = 64
}
