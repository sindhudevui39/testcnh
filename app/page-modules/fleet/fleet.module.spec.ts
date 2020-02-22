import { FleetModule } from './fleet.module';

describe('FleetModule', () => {
  let fleetModule: FleetModule;

  beforeEach(() => {
    fleetModule = new FleetModule();
  });

  it('should create an instance', () => {
    expect(fleetModule).toBeTruthy();
  });
});
