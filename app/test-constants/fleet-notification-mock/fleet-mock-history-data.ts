export const dummyHistories = [
  {
    brand: 'Case IH',
    canRule: {
      familyCode: 'ENG_LOAD',
      familyName: 'Engine Load',
      muLabel: '%',
      muCode: '%',
      condition: 'LT',
      durationMs: 300,
      numericThreshold: 50
    },
    dateTime: '2019-04-04T19:25:53.000+0000',
    name: 'test',
    vehicleName: 'Connected Service Tractor',
    vehicleSerialNumber: '1223-090093FA'
  },
  {
    brand: 'Case IH',
    canRule: {
      condition: 'GT',
      durationMs: 8,
      familyCode: 'GROUND_SPEED',
      familyName: 'Ground speed',
      muCode: 'KM/H',
      muLabel: 'Km/h',
      numericThreshold: 10
    },
    dateTime: '2019-04-04T19:25:53.000+0000',
    name: 'test',
    vehicleName: 'Connected Service Tractor',
    vehicleSerialNumber: '1223-09000FD7'
  }
];
