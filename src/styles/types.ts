import { RequireAtLeastOne } from '../types';

export type unit = 'vh'
| 'vw'
| '%'
| 'em'
// | 'rem'
| 'ch'
| 'u';
export type size = [number, unit] | number;

export type color = string | [number, number, number];

export interface AllStyle {
  overflowX: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY: 'visible' | 'hidden' | 'scroll' | 'auto';
}

export interface BaseAllStyle {
  backgroundColor: color;
  color: color;
}

type BorderStyles = 'solid'
| 'dotted'
| 'double';
type BorderWidths = size
| 'thick'
| 'bold';

/* Making types for display */

export interface DisplayInline {
  display: 'inline';
}
export interface DisplayUninline {
  height: size | 'content' | 'auto'; // TODO add support for min-content
  width: size | 'content' | 'auto';
  border: [BorderStyles] | [BorderWidths, BorderStyles] | [BorderStyles, color] | [BorderWidths, BorderStyles, color] | 'none';
  resize: 'none' | 'horizontal' | 'vertical' | 'both';
  margin: size;
  padding: size;
}
export interface DisplayBlock extends DisplayUninline {
  display: 'block';
}
export interface DisplayFlex extends DisplayUninline {
  display: 'flex';
  flexDirection: 'row' | 'column';
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
}
export type DisplayInlineBlock = { display: 'inline-block' }
& (DisplayInline | DisplayBlock);

/* Making types for position */

export interface PositionUnstatic {
  zIndex: number;
}

export type PositionSticky = PositionUnstatic
& RequireAtLeastOne<{
  top: size;
  bottom: size;
  left: size;
  right: size;
}>
& { position: 'sticky' };

export type PositionAbsolute = PositionUnstatic
& RequireAtLeastOne<{
  top: size;
  bottom: size;
}>
& RequireAtLeastOne<{
  left: size;
  right: size;
}> & { position: 'absolute' };

export interface PositionFixedOrRelative {
  top?: size;
  bottom?: size;
  left?: size;
  right?: size;
  position: 'fixed' | 'relative';
};

export interface PositionStatic {
  position: 'static';
}

export type BaseStyle = BaseAllStyle
& (DisplayInline| DisplayBlock | DisplayInlineBlock)
& (PositionUnstatic | PositionStatic);
