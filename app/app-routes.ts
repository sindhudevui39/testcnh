const dasbhoardRoute = '/dashboard';
const dataRoute = '/data';
const dataRouteFromMail = '/data-access';
const fleetRoute = '/fleet';

export const validModuleRoutes = [dasbhoardRoute, dataRoute, fleetRoute];

export const validApplicationRoutes = [
  `${dataRoute}/inbox`,
  `${dataRoute}/data-access`,
  `${dataRoute}/data-access/my-data`,
  `${dataRoute}/data-access/partner-data`,
  `${dataRoute}/connections`,
  `${fleetRoute}/overview`,
  `${fleetRoute}/faults`,
  `${fleetRoute}/faults/overview`,
  `${fleetRoute}/service`,
  `${fleetRoute}/notifications`,
  `${fleetRoute}/notifications/manage`,
  `${fleetRoute}/notifications/history`
];

export const validApplicationRoutesWithId = [
  `${dataRoute}/data-access/my-data/`,
  `${dataRoute}/data-access/partner-data/`,
  `${dataRouteFromMail}`,
  `${fleetRoute}/faults/`,
  `${fleetRoute}/overview/`,
  `${fleetRoute}/service/`,
  `${fleetRoute}/faults/detail/`,
  `${dataRouteFromMail}`,
  `${fleetRoute}/detail/`
];
