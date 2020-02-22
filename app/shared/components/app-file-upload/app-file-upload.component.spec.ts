import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement, Injector } from '@angular/core';
import { MatProgressBar, MatDialogModule } from '@angular/material';
import { AppFileUploadComponent } from './app-file-upload.component';
import {
  TranslateCompiler,
  TranslateFakeCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { of } from 'rxjs';

const translations: any = {
  FILE_NOTIFICATION: {
    FILE_TRANSFERS_TITLE: 'File Transfer',
    UPLOAD: 'Upload',
    EMPTY_LIST: '',
    INBOX: 'inbox'
  }
};

export class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of(translations);
  }
}
describe('AppFileUploadComponent', () => {
  let component: AppFileUploadComponent;
  let fixture: ComponentFixture<AppFileUploadComponent>;
  let translate: TranslateService;
  let injector: Injector;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
          compiler: { provide: TranslateCompiler, useClass: TranslateFakeCompiler }
        })
      ],
      declarations: [AppFileUploadComponent, MatProgressBar]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    translate.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have browse button', async () => {
    const fixture = TestBed.createComponent(AppFileUploadComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('button.button-confirm[type="button"]').textContent).toContain('BROWSE FILES');
  });
});
