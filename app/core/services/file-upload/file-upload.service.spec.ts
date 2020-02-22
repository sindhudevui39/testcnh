import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FileUploadService]
    });
  });

  it('should be created', inject(
    [FileUploadService],
    (service: FileUploadService) => {
      expect(service).toBeTruthy();
    }
  ));
});
