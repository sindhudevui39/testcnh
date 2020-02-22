export interface CustomParameterData {
  code?: string;
  label: string;
  muCode?: string;
  timestamp?: string;
  unit?: string;
  uomCode?: string;
  value: any;
}
interface Fleet {
  id: string;
  name: string;
}

interface Type {
  code: string;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

export interface OverviewListvehicleData {
  brand: string;
  capabilities: any;
  custom1: any;
  custom2: any;
  custom1ParamLabel: string;
  custom2ParamLabel: string;
  engineHoursData: EngineHoursData;
  fleets: [Fleet];
  id: string;
  image: string;
  isClimateVehicle: boolean;
  isClimateVehicleDisconneted?: boolean;
  lastUpdate: string;
  model: string;
  name: string;
  status: string;
  statusColor: string;
  statusName: string;
  statusText: string;
  serialNumber: string;
  statusALERTS: string;
  type: Type;
}

export interface EngineHoursData {
  value: any;
  unit: string;
}
export interface CustomLabels {
  label1: string;
  label2: string;
}
