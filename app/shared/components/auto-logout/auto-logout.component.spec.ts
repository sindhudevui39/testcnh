import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLogoutComponent } from './auto-logout.component';
import { AutoLogoutService } from '@services/auto-logout/auto-logout.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

describe('AutoLogoutComponent', () => {
  let component: AutoLogoutComponent;
  let fixture: ComponentFixture<AutoLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule],
      declarations: [AutoLogoutComponent],
      providers: [
        AutoLogoutService,
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
