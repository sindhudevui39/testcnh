import { FleetCanRule } from './fleet-can-rule';

export interface FleetHistory {
  vehicleName: string;
  name: string;
  brand: string;
  vehicleSerialNumber: string;
  canRule: FleetCanRule;
  dateTime: string;
}
