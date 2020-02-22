import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingRingComponent } from './loading-ring.component';

describe('LoaderComponent', () => {
  let component: LoadingRingComponent;
  let fixture: ComponentFixture<LoadingRingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingRingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingRingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
