import { FleetCanRule } from './fleet-can-rule';

export interface FleetNotification {
  id: string;
  name: string;
  modelsCount: string;
  vehiclesCount: string;
  usersCount?: string;
  notificationGroupId: string;
  channels?: Array<string>;
  canRule: string;
}
