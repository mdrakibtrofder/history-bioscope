'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/misc';

const loading = () => <Skeleton className="h-full min-h-64 w-full" />;
export const MiniMap = dynamic(() => import('./mini-map'), { ssr: false, loading });
export const LocationPicker = dynamic(() => import('./location-picker'), { ssr: false, loading });
export const MapExplorer = dynamic(() => import('./map-explorer'), { ssr: false, loading });
