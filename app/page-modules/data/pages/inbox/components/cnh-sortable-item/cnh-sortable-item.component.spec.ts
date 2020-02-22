import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CnhSortableItemComponent } from './cnh-sortable-item.component';
import { Observable, of } from 'rxjs';
import { By } from 'selenium-webdriver';

describe('CnhSortableItemComponent', () => {
  let component: CnhSortableItemComponent;
  let fixture: ComponentFixture<CnhSortableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CnhSortableItemComponent],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnhSortableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
