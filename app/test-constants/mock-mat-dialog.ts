import { of } from 'rxjs';

export class MockMatDialog {
  open(comp: any, data: any) {
    return {
      afterClosed: function() {
        return of({});
      }
    };
  }
}
