import type { ComparisonParams, TimelineParams } from '../data/types';

/** One frame of a visualization. Everything a draw call needs, nothing else. */
export interface Frame {
  ctx: CanvasRenderingContext2D;
  /** CSS pixel size of the canvas. */
  w: number;
  h: number;
  /** How far the "what if" change has progressed, 0 (reality) → 1 (fully changed). */
  p: number;
  /** Ambient clock in seconds — drives motion that isn't the change itself (orbits, flow). */
  t: number;
  /** Seconds since the previous frame (0 on a static redraw). */
  dt: number;
  reduced: boolean;
}

export interface Readout {
  label: string;
  value: string;
  /** Marks values computed from a formula rather than drawn for illustration. */
  calculated?: boolean;
}

export interface Visualization {
  draw(frame: Frame): void;
  /** Live numbers shown beside the stage. */
  readouts?(p: number): Readout[];
  /** Screen-reader text for the scrubber's current position. */
  valueText(p: number): string;
  /** True if the visual has motion even when the change isn't playing. */
  ambient: boolean;
  /** Preferred aspect ratio (width / height) at wide and narrow sizes. */
  aspect?: { wide: number; narrow: number };
}

export interface VizOptions {
  accent: string;
  /** Data for the generic visual types (comparison, timeline). */
  params?: ComparisonParams | TimelineParams;
}

export type VizFactory = (opts: VizOptions) => Visualization;
