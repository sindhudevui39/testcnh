import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteDisplayViewComponent } from './remote-display-view.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RdvUiService } from '@remote-display/services/rdv-ui/rdv-ui.service';
import { UserService } from '@services/user/user.service';

describe('RemoteDisplayViewComponent', () => {
  let userService: UserService;
  let rdvUiService: RdvUiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatDialogModule,
        HttpClientModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [RemoteDisplayViewComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        },
        RdvUiService,
        UserService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    rdvUiService = TestBed.get(RdvUiService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RemoteDisplayViewComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
