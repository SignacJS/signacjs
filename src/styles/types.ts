import { RequireAtLeastOne } from "../types";

export type unit =
  | "vh"
  | "vw"
  | "v"
  | "%w"
  | "%h"
  | "%"
  | "ch"
  | "em"
  | "w"
  | "h"
  | "c";
export const unitScope: Record<unit, "viewport" | "percent" | "character"> = {
  vw: "viewport",
  vh: "viewport",
  v: "viewport",
  "%w": "percent",
  "%h": "percent",
  "%": "percent",
  ch: "character",
  em: "character",
  w: "character",
  h: "character",
  c: "character",
};
export type unitNoAdapt = Exclude<unit, "v" | "%" | "c">;
export const WoHPartial: Record<unitNoAdapt, "W" | "H"> = {
  // Width or Height
  vw: "W",
  vh: "H",
  "%w": "W",
  "%h": "H",
  ch: "W",
  em: "H",
  w: "W",
  h: "H",
};

export type size = [number, unit] | number;

export type color =
  | [number, number, number, number?]
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "transparent"
  | "initial";

export interface AllStyle {
  overflowX: Style<"visible" | "hidden" | "scroll" | "auto">;
  overflowY: Style<"visible" | "hidden" | "scroll" | "auto">;
}

export interface BaseAllStyle {
  backgroundColor: Style<color>;
  color: Style<color>;
}

type BorderStyles = "solid" | "dotted" | "double";
type BorderWidths = size | "thick" | "bold";

export type Style<T> = T | "inherit" | "unset" | "initial";

/* Making types for display */

export interface DisplayInline {
  display: "inline";
}
export interface DisplayUninline {
  height: Style<size | "content" | "auto">; // TODO add support for min-content
  width: Style<size | "content" | "auto">;
  border: Style<
    | [BorderStyles]
    | [BorderWidths, BorderStyles]
    | [BorderStyles, color]
    | [BorderWidths, BorderStyles, color]
    | "none"
  >;
  resize: Style<"none" | "horizontal" | "vertical" | "both">;
  margin: Style<size>;
  padding: Style<size>;
}
export interface DisplayBlock extends DisplayUninline {
  display: "block";
}
export interface DisplayFlex extends DisplayUninline {
  display: "flex";
  flexDirection: Style<"row" | "column">;
  justifyContent: Style<
    "flex-start" | "flex-end" | "center" | "space-between" | "space-around"
  >;
  alignItems: Style<
    "flex-start" | "flex-end" | "center" | "baseline" | "stretch"
  >;
  flexWrap: Style<"nowrap" | "wrap" | "wrap-reverse">;
}
export type DisplayInlineBlock = { display: "inline-block" } & (
  | DisplayInline
  | DisplayBlock
);

/* Making types for position */

export interface PositionUnstatic {
  zIndex: Style<number>;
}

export type PositionSticky = PositionUnstatic &
  RequireAtLeastOne<{
    top: Style<size>;
    bottom: Style<size>;
    left: Style<size>;
    right: Style<size>;
  }> & { position: "sticky" };

export type PositionAbsolute = PositionUnstatic &
  RequireAtLeastOne<{
    top: Style<size>;
    bottom: Style<size>;
  }> &
  RequireAtLeastOne<{
    left: Style<size>;
    right: Style<size>;
  }> & { position: "absolute" };

export interface PositionFixedOrRelative {
  top?: Style<size>;
  bottom?: Style<size>;
  left?: Style<size>;
  right?: Style<size>;
  position: "fixed" | "relative";
}

export interface PositionStatic {
  position: "static";
}

export type BaseStyle = BaseAllStyle &
  (DisplayInline | DisplayBlock | DisplayInlineBlock) &
  (PositionUnstatic | PositionStatic);
