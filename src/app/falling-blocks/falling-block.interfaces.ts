export interface BlockData {
  text: string;
  width: number;
  linkText: string;
  link: string;
}

export interface LandedBlockInfo {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResponsiveDimensions {
  containerWidth: number;
  containerHeight: number;
  blockHeight: number;
  fontSize: number;
  padding: number;
  margin: number;
}
