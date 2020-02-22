import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { DebugElement, Injector } from '@angular/core';
import { FileUploadService } from '@services/file-upload/file-upload.service';
import { UploadDialogComponent } from './upload-dialog.component';
import { of } from 'rxjs';
import { DndDirectiveDirective } from '../directive/dnd-directive.directive';
import {
  TranslateCompiler,
  TranslateFakeCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

const translations: any = {
  FILE_NOTIFICATION: {
    UPLOAD_FILE: {
      TITLE: 'Upload file',
      DND: 'Drag and drop files here!',
      ZIP_LIMIT: 'Only zipped (.zip) files up to 256 MB',
      FILE_TYPES:
        'Supported file formats: .CN1 and ISOXML from the AFS Pro700, Pro600, Pro300, PLM IntelliView IV, IntelliView III, and IntelliView Plus II. ISO files from other Displays are not fully supported and may lead to incorrectly processed data.',
      OR: 'or',
      BROWSE: 'browse files'
    }
  }
};

export class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of(translations);
  }
}

describe('UploadDialogComponent', () => {
  let component: UploadDialogComponent;
  let fixture: ComponentFixture<UploadDialogComponent>;
  let translate: TranslateService;
  let injector: Injector;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
          compiler: { provide: TranslateCompiler, useClass: TranslateFakeCompiler }
        })
      ],
      declarations: [UploadDialogComponent, DndDirectiveDirective],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        FileUploadService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDialogComponent);
    component = fixture.componentInstance;
    injector = getTestBed();
    translate = injector.get(TranslateService);
    translate.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have mat dialog title', async () => {
    const fixture = TestBed.createComponent(UploadDialogComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.mat-dialog-title').textContent).toContain('Upload file');
  });

  it('should have mat dialog content', async () => {
    const fixture = TestBed.createComponent(UploadDialogComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.mat-dialog-content').textContent).toContain(
      'Drag and drop files here!'
    );
  });

  it('should have browse button', async () => {
    const fixture = TestBed.createComponent(UploadDialogComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.button-confirm[type="button"]').textContent).toContain(
      'BROWSE FILES'
    );
  });
});
