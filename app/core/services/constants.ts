export enum Status {
  WORKING = 'In Work',
  KEYON = 'Key On',
  IDLE = 'Idle',
  MOVING = 'Moving',
  TRAVELLING = 'Travelling',
  OFF = 'Engine Off'
}

export enum FleetStatus {
  WORKING = 'In Work',
  KEYON = 'Key On',
  IDLE = 'Idle',
  MOVING = 'Moving',
  TRAVELING = 'Traveling',
  OFF = 'Off'
}

export enum StatusColors {
  WORKING = '#25b03d',
  KEYON = '#ffc107',
  IDLE = '#f47825',
  MOVING = '#01a8b4',
  TRAVELLING = '#035db1',
  OFF = '#adadad'
}

export const colors = [
  {
    backgroundColor: [
      StatusColors.WORKING,
      StatusColors.KEYON,
      StatusColors.IDLE,
      StatusColors.MOVING,
      StatusColors.TRAVELLING,
      StatusColors.OFF
    ]
  }
];

export const options = {
  tooltips: {
    enabled: false
  },
  pieceLabel: {
    render: 'value',
    fontColor: '#fff'
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 12
    }
  }
};
