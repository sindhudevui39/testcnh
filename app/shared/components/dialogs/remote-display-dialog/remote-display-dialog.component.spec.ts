import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteDisplayDialogComponent } from './remote-display-dialog.component';

describe('RemoteDisplayDialogComponent', () => {
  let component: RemoteDisplayDialogComponent;
  let fixture: ComponentFixture<RemoteDisplayDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteDisplayDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
