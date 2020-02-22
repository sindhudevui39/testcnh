export interface FleetVehicle {
  id: string;
  name: string;
  model: string;
  fleet: Array<Fleets>;
  isClimateVehicle: boolean;
}

interface Fleets {
  id: string;
  name: string;
}
