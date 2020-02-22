import { FleetCondition } from '@enums/fleet-condition';

export interface FleetCanRule {
  familyName?: string;
  familyCode?: string;
  muLabel?: string;
  muCode?: string;
  condition?: FleetCondition;
  numericThreshold?: number;
  durationMs: number;
  label?: string;
  unit?: string;
  threshold?: number;
  code?: string;
}
