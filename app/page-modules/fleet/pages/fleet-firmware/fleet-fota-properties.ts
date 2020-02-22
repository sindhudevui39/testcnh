export interface FotaSortOption {
  name: string;
  id: string;
}

export const SOFTWARE_NOTIFIED: FotaSortOption[] = [
  { id: 'all_notified', name: 'Notified (All)' },
  { id: 'notified', name: 'Notified' },
  { id: 'not_notified', name: 'Not Notified' },
  { id: 'notification_failed', name: 'Notification failed' }
];

export const SOFTWARE_DOWNLOADED: FotaSortOption[] = [
  { id: 'all_downloaded', name: 'Downloaded (All)' },
  { id: 'downloaded', name: 'Downloaded' },
  { id: 'not_downloaded', name: 'Not Downloaded' },
  { id: 'downloaded_failed', name: 'Download failed' }
];

export const SOFTWARE_INSTALLED: FotaSortOption[] = [
  { id: 'all_installed', name: 'Installed (All)' },
  { id: 'installed', name: 'Installed' },
  { id: 'not_installed', name: 'Not Installed' },
  { id: 'installation_failed', name: 'Installation failed' }
];

export enum FOTAStatus {
  PENDING = 'PENDING',
  NOTIFIED = 'NOTIFIED',
  DOWNLOADED = 'DOWNLOADED',
  INSTALLED = 'INSTALLED',
  CANCELED = 'CANCELED'
}

export enum FOTAStatusResult {
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS'
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
