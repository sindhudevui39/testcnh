import { ConnectionStatus } from './rdv.enums';

export interface IConnectionStatus {
  enable: boolean;
  socketResponse?: ISocketResponse;
  vehicleName?: string;
}

export interface IRDVEvent {
  event: string;
  firstname: string;
  lastname: string;
  timeStamp: number;
}

export interface IDeviceNotification {
  notification: IRDVEvent;
  vehicleIDList: Array<string>;
}

export interface ITransactionId {
  transactionId: string;
  requestId: string;
}

export interface IRdvSettings {
  enableRdv: boolean;
  minVersion: number;
  maxVersionCheck: number;
  notificationUrl: string;
  tvAppInstall: string;
}

export interface ISocketResponse {
  abort?: boolean;
  abortMessage?: string;
  code?: string;
  connectionStatus?: ConnectionStatus;
  launchTvApp?: boolean;
  tvAppUrl?: string;
  updateView?: boolean;
  updateMessage?: string;
}
