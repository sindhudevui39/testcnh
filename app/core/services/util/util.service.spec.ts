import { TestBed, getTestBed } from '@angular/core/testing';

import { UtilService } from './util.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UtilService', () => {
  let injector: TestBed;
  let service: UtilService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UtilService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    });
    injector = getTestBed();
    service = injector.get(UtilService);
    // httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the scaled value', () => {
    const unscaledNum = 5;
    const minAllowed = 0;
    const maxAllowed = 100;
    const min = 0;
    const max = 10;

    expect(service.scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max)).toEqual(50);
  });

  it('should return the CASE-brand-combine image URL', () => {
    const unit = {
      brand: 'Case IH',
      type: {
        code: 'TRACTOR',
        name: 'Tractor'
      }
    };

    const url = './assets/Icon-Vehicle-Cih/icon-vehicle-cih-tractor-cch-medium.png';

    expect(service.getImageUrl(unit)).toEqual(url);
  });

  it('should return the CASE-brand-tractor image URL', () => {
    const unit = {
      brand: 'Case IH',
      type: { code: 'COMBINE', name: 'Combine' }
    };

    const url = './assets/Icon-Vehicle-Cih/icon-vehicle-cih-combine-medium.png';

    expect(service.getImageUrl(unit)).toEqual(url);
  });
});
