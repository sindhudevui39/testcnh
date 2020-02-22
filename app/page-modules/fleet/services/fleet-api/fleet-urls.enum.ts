export enum FleetUrls {
  //#region GET calls
  VEHICLE_CHART_DATA = 'api/fleet/get/duty',
  VEHICLE_FUEL_DATA = 'api/fleet/get/fuel',
  FOTA_CAMPAIGNS = 'api/fleet/get/GetFOTACampaigns',
  FOTA_CAMPAIGN_BY_ID = 'api/fleet/get/GetFOTACampaignById',
  ALLOWED_PARAMS = 'api/fleet/get/allowedparameters',
  FLEET_NOTIFICATIONS_GROUPS = 'api/fleet/get/NotificationGroups',
  FLEET_USER_NOTIFICATIONS = 'api/fleet/get/UserNotifications',
  FLEET_CUSTOM_NOTIFICATIONS = 'api/fleet/get/CustomNotifications',
  FLEET_HISTORY = 'api/fleet/get/History',
  VEHICLE_DATA = 'api/get/units/',
  FLEET_COMPANY_USERS = 'api/fleet/get/CompanyUsers',
  FLEET_ALL_FAULTS_DETAILS = 'api/fleet/get/allFaultsDetail',
  FLEET_FAULTS_BY_ID = 'api/fleet/get/faultDetail',
  FLEET_EDIT_CUSTOM_NOTIFICATION = 'api/fleet/put/CustomNotification',
  FLEET_FAULTS_HISTORY = 'api/fleet/get/faultsHistory',
  FLEET_USER_PREFERENCES_GET = 'api/fleet/get/userpreferences',
  GET_CAN_AND_NOTIFICATION_GROUP_ID = 'api/fleet/get/GetCanAndNotificationGroupId',
  GETUSERS = 'api/fleet/get/GetUsers',
  USER_NOTIFICATIONS = 'api/fleet/get/GetNotifications',

  //#endregion

  //#region POST PATCH and PUT
  FLEET_POST_FAMILIES = 'api/fleet/post/Families',
  FLEET_POST_VEHICLES = 'api/fleet/post/Vehicles',
  FLEET_POST_CAN = 'api/fleet/post/Can',
  FLEET_POST_CUSTOM_RULE = 'api/fleet/post/CustomRule',
  VEHICLE_FOR_RULE = 'api/fleet/post/VehicleForRule',
  FLEET_USER_PREFERENCES_PUT = 'api/fleet/put/userpreferences',
  PUT_NOTIFICATIONS = 'api/fleet/put/PutNotifications',
  PUT_CUSTOM_NOTIFICATIONS = 'api/fleet/put/PutCustomNotifications',
  FOTA_DEVICE_NOTIFICATION = 'api/fleet/post/FOTADeviceNotification',

  //#endregion

  //#region DELETE
  FLEET_DELETE_CUSTOM_NOTIFICATION = 'api/fleet/delete/CustomNotification',
  FLEET_DELETE_USER_NOTIFICATION = 'api/fleet/delete/UserNotification'

  //#endregion
}
