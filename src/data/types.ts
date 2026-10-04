/**
 * Scenario content model.
 *
 * A scenario is a graph of discovery nodes, starting at `entry`. A node either
 * offers `choices` (which consequence to follow next) or ends the exploration
 * with a `conclusion`. Everything — branching included — is data; the page,
 * router and stage are generic over it.
 */

/** How confident the science behind a statement is. */
export type ScientificStatus = 'established' | 'inferred' | 'hypothetical';

export type ScenarioCategory = 'Planetary' | 'Cosmic' | 'Human' | 'Biology' | 'Ocean' | 'Atmosphere';

/** Keys into the visualization registry (src/viz/registry.ts). */
export type VisualizationType =
  | 'earth-rotation'
  | 'sunlight-delay'
  | 'sleepless-day'
  | 'magnetic-shield'
  | 'lunar-tides'
  | 'regeneration'
  | 'rogue-orbit'
  | 'generations'
  | 'ocean-salinity'
  | 'dense-atmosphere'
  // Generic, data-driven visuals used by branch nodes.
  | 'comparison'
  | 'timeline';

/** A caption shown on the stage once the visualization passes `at` (0–1). */
export interface StageCaption {
  at: number;
  text: string;
}

export interface VisualizationSpec {
  type: VisualizationType;
  /** Label for the button that applies the change, e.g. "Stop the rotation". */
  triggerLabel: string;
  /** Accessible label for the scrubber, e.g. "How far the rotation has slowed". */
  scrubLabel: string;
  /** Seconds the full change takes when played at normal speed. */
  duration: number;
  /** Honest framing for what is drawn: what's to scale, what's exaggerated. */
  disclaimer: string;
  /** Plain-language description of the whole visualization for screen readers. */
  description: string;
  captions: StageCaption[];
  /** Data for the generic visual types. */
  params?: ComparisonParams | TimelineParams;
}

/** One bar (or range, when `min` is set) in a comparison chart. */
export interface ComparisonItem {
  label: string;
  value: number;
  min?: number;
  /** Human-readable value, e.g. "≈ 1,040 km/h". */
  display: string;
  status: ScientificStatus;
  /** True for the hypothetical/changed values — these grow in as the visual plays. */
  changed?: boolean;
  /** Value comes from a formula (shown with a "calc" tag). */
  calculated?: boolean;
}

export interface ComparisonParams {
  kind: 'comparison';
  unit: string;
  scale: 'linear' | 'log';
  items: ComparisonItem[];
}

export interface TimelineEvent {
  /** Seconds after the change. */
  at: number;
  label: string;
  /** Human-readable time, e.g. "≈ 1 week". */
  display: string;
  status: ScientificStatus;
}

export interface TimelineParams {
  kind: 'timeline';
  scale: 'linear' | 'log';
  /** Seconds. For log scales `from` must be > 0. */
  from: number;
  to: number;
  events: TimelineEvent[];
}

export interface Fact {
  status: ScientificStatus;
  text: string;
}

/** The one number/idea we want people to remember. */
export interface Highlight {
  value: string;
  label: string;
  status: ScientificStatus;
  /** If the value is computed, say how. */
  basis?: string;
}

/** A consequence the reader can choose to follow next. Not an answer — both options happen. */
export interface Choice {
  label: string;
  description: string;
  /** Id of the discovery this choice leads to. */
  next: string;
}

export interface ConclusionNumber {
  value: string;
  label: string;
  status: ScientificStatus;
  calculated?: boolean;
}

/** What the chain of consequences means, shown on final nodes. */
export interface Conclusion {
  title: string;
  summary: string[];
  numbers: ConclusionNumber[];
  takeaway: string;
}

export interface Discovery {
  id: string;
  /** Short name for this consequence, used in the reader's path ("The air"). */
  label: string;
  /** The consequence, stated as a headline. */
  title: string;
  /** One curiosity line shown at the top of the node (the scenario intro is used for the entry). */
  hook?: string;
  /** Short paragraphs. Keep to ~3. */
  explanation: string[];
  status: ScientificStatus;
  highlight?: Highlight;
  facts: Fact[];
  /** Only where a visual genuinely helps. */
  visualization?: VisualizationSpec;
  /** Two consequences to follow next… */
  choices?: Choice[];
  /** …or the end of the exploration. */
  conclusion?: Conclusion;
}

/** Everything needed to list and link a question — always loaded. */
export interface ScenarioMeta {
  id: string;
  number: number;
  /** Full question, e.g. "What if Earth suddenly stopped rotating?" */
  question: string;
  /** The question without "What if" — displayed huge on the scenario page. */
  premise: string;
  teaser: string;
  /** Compact name used in the reader's path, e.g. "Earth stops rotating". */
  shortTitle: string;
  category: ScenarioCategory;
  /** Subtle per-scenario accent colour (hex). */
  accent: string;
  /** One curiosity-building sentence shown before the visual. */
  intro: string;
  /** Line-art identity on the home card (the entry node's visual type). */
  glyph: VisualizationType;
  /** Loads the discovery graph on demand. */
  load: () => Promise<{ default: ScenarioContent }>;
}

/** The discovery graph of one scenario — loaded when the question is opened. */
export interface ScenarioContent {
  /** Id of the first discovery node. */
  entry: string;
  discoveries: Record<string, Discovery>;
}

export type Scenario = ScenarioMeta & ScenarioContent;
