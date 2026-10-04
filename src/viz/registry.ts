import type { VisualizationType } from '../data/types';
import type { VizFactory } from './types';

type Loader = () => Promise<{ default: VizFactory }>;

/** Each visualization is its own chunk, loaded only when its scenario opens. */
const loaders: Record<VisualizationType, Loader> = {
  'earth-rotation': () => import('./earth-rotation'),
  'sunlight-delay': () => import('./sunlight-delay'),
  'sleepless-day': () => import('./sleepless-day'),
  'magnetic-shield': () => import('./magnetic-shield'),
  'lunar-tides': () => import('./lunar-tides'),
  regeneration: () => import('./regeneration'),
  'rogue-orbit': () => import('./rogue-orbit'),
  generations: () => import('./generations'),
  'ocean-salinity': () => import('./ocean-salinity'),
  'dense-atmosphere': () => import('./dense-atmosphere'),
  comparison: () => import('./comparison'),
  timeline: () => import('./timeline'),
};

export async function loadVisualization(type: VisualizationType): Promise<VizFactory> {
  const loader = loaders[type];
  if (!loader) throw new Error(`Unknown visualization type: ${type}`);
  const mod = await loader();
  return mod.default;
}
