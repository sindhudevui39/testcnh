import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material';
import { HeaderComponent } from '@shared-components/header/header.component';
import { SideNavComponent } from '@shared-components/side-nav/side-nav.component';
import { AutoLogoutComponent } from '@shared-components/auto-logout/auto-logout.component';
import { AppRoutingModule } from './app-routing.module';
import { AppNotificationHistroyComponent } from '@shared-components/app-notification-histroy/app-notification-histroy.component';
import { FaviconModule } from './favicon/favicon.module';
import { AutoLogoutService } from '@services/auto-logout/auto-logout.service';
import { AppFileUploadComponent } from '@shared-components/app-file-upload/app-file-upload.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
        FaviconModule.forRoot(),
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        SideNavComponent,
        AutoLogoutComponent,
        AppNotificationHistroyComponent,
        AppFileUploadComponent
      ],
      providers: [
        {
          provide: 'window',
          useValue: window
        },
        AutoLogoutService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });
});
