import { TestBed, inject } from '@angular/core/testing';

import { EventsService } from './events.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService]
    });
  });

  it('should be created', inject([EventsService], (service: EventsService) => {
    expect(service).toBeTruthy();
  }));
});
