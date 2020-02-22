interface PropInfo {
  src: string;
  text: string;
}

interface AddWidgetItem {
  id: string;
  enabled: boolean;
  prop: PropInfo;
}

export const widgetList: Array<AddWidgetItem> = [
  {
    id: 'vehicle-status',
    enabled: false,
    prop: {
      src: 'assets/add-widget-images/status-widget-2@2x.png',
      text: 'Info for Vehicle Status Widget'
    }
  },
  {
    id: 'active-high-severity-faults',
    enabled: false,
    prop: {
      src: 'assets/add-widget-images/faults@2x.png',
      text: 'Info for Active High Faults Widget'
    }
  },
  {
    id: 'area-covered',
    enabled: false,
    prop: {
      src: 'assets/add-widget-images/area-covered@2x.png',
      text: 'Info for Area Covered Widget'
    }
  },
  {
    id: 'low-fuel',
    enabled: false,
    prop: {
      src: 'assets/add-widget-images/low-fuel-2@2x.png',
      text: 'Info for Low Fuel Widget'
    }
  },
  {
    id: 'total-fuel-consumption',
    enabled: false,
    prop: {
      src: 'assets/add-widget-images/t-fuel-1@2x.png',
      text: 'Info for Total Fuel Consumtion Widget'
    }
  },
  {
    id: 'daily-fuel-consumption',
    enabled: false,
    prop: {
      src: 'assets/add-widget-images/daily-fuel@2x.png',
      text: 'Info for Daily Fuel Consumption Widget'
    }
  }
];
