import { Coord } from "core/compiler";

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

export enum MapZoomViewLevel {
    Overview = 2, // Looking at the entire map or most of the map (2-3)
    Region = 4, // 4-5
    Detail = 6, // Looking at a detailed area, such as village or town (6-8)
}

export type GeoCoordinates = {
    type: "G" /*Geo*/,
    lat: number,
    lng: number,
}

export const geoCoord = (lat: number, lng: number):GeoCoordinates => ({type: "G", lat, lng});

export type InGameCoordinates = {
    type: "I",
    x: number,
    z: number,
}

export const inGameCoord = (x: number, z: number):InGameCoordinates => ({type: "I", x, z});

export type SvgCoordinates = {
    type: "S",
    x: number,
    z: number,
}

export const svgCoord = (x: number, z: number):SvgCoordinates => ({type: "S", x, z});

export type SvgPolygon = SvgCoordinates[];
