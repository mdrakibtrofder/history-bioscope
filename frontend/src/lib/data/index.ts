import { ApiDataSource } from './api-source';
import { LocalStorageDataSource } from './local-source';
import type { DataSource } from './source';

export type DataMode = 'api' | 'local';

/** Factory – returns the data provider for the selected mode. */
const instances: Partial<Record<DataMode, DataSource>> = {};
export function getDataSource(mode: DataMode): DataSource {
  if (!instances[mode]) instances[mode] = mode === 'api' ? new ApiDataSource() : new LocalStorageDataSource();
  return instances[mode]!;
}

export { API_URL, apiAvailable } from './api-source';
export type { DataSource } from './source';
