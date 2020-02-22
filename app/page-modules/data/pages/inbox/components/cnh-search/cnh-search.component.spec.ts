import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CnhSearchComponent } from './cnh-search.component';
import { Observable, of } from 'rxjs';
import { By } from 'selenium-webdriver';

describe('CnhCollapsibleComponent', () => {
  let component: CnhSearchComponent;
  let fixture: ComponentFixture<CnhSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CnhSearchComponent],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnhSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
