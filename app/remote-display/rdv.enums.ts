export enum ConnectionStatus {
  WAITING = 'WAITING',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED',
  CLOSED = 'CLOSED'
}

export enum DeviceNotificationEvent {
  ABORT = 'RDV.ABORT',
  START = 'RDV.START',
  FOTA_START = 'FOTA.START'
}

export enum TranslatedRDVLabels {
  'GLOBAL.CTA.CANCEL',
  'GLOBAL.CTA.OK',
  'PAGE_RDV.CTA.END_SESSION',
  'PAGE_RDV.END',
  'PAGE_RDV.END_TXT',
  'PAGE_RDV.SUB_INACTIVE',
  'PAGE_RDV.TERMINATION_CLIENT',
  'PAGE_RDV.TERMINATION_HOST',
  'PAGE_RDV.TIME_LEFT',
  'PAGE_RDV.MESSAGES.ERROR_1',
  'PAGE_RDV.MESSAGES.ERROR_2',
  'PAGE_RDV.MESSAGES.ERROR_3',
  'PAGE_RDV.MESSAGES.ERROR_4',
  'PAGE_RDV.MESSAGES.ERROR_5',
  'PAGE_RDV.MESSAGES.FAILED',
  'PAGE_RDV.MESSAGES.RUNNING',
  'PAGE_RDV.MESSAGES.WAITING',
  'PAGE_RDV.TW_NOT_INSTALLED'
}

export enum RdvSocketMessages {
  SUCCESS_001_1 = 'Success - Connection URL generated.',
  SUCCESS_001_2 = 'Success - Session Aborted.',
  PENDING_002_1 = 'Pending - Session request accepted by the user',
  FAILED_003_1 = 'Failed - Device is not able to process tv app',
  FAILED_003_2 = 'Failed - Unable to fetch the connection URL',
  FAILED_004_1 = 'Failed - Vehicle is not having Remote Display Subscription',
  FAILED_005_1 = 'Failed - Session request rejected by the user',
  FAILED_006_1 = 'Failed - Host aborted the session.',
  FAILED_007_1 = 'Failed - Session terminated due to connection issues.',
  FAILED_008_1 = 'Failed - Client aborted the session.',
  FAILED_009_1 = 'Failed - Request Timeout',
  FAILED_010_1 = 'Failed - Failed - Session Timeout'
}

export enum RdvDialogTypes {
  INSTALL = 'INSTALL',
  UNSUPPORTED_VERSION = 'UNSUPPORTED_VERSION',
  INACTIVE_SUBSCRIPTION = 'INACTIVE_SUBSCRIPTION',
  END_SESSION = 'END_SESSION'
}

export enum RDVUrls {
  'DEVICE_NOTIFICATION' = 'api/rdv/post/devicenotification',
  'RDV_SETTINGS' = 'api/rdv/get/settings'
}
