export type ShapeType = 'rect' | 'circle' | 'diamond' | 'line' | 'select';

export interface BaseShape {
  id: string;
  type: ShapeType;
  stroke: string;
  strokeWidth: number;
}

export interface RectShape extends BaseShape {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
}

export interface DiamondShape extends BaseShape {
  type: 'diamond';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LineShape extends BaseShape {
  type: 'line';
  points: number[];
}

export type Shape = RectShape | CircleShape | DiamondShape | LineShape;
