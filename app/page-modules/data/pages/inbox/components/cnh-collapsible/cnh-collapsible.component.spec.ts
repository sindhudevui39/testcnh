import { async, ComponentFixture, TestBed, getTestBed} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CnhCollapsibleComponent } from './cnh-collapsible.component';
import { DataAccessClientsService } from '../../../../pages/data-access/services/data-access.services';
import { Observable, of } from 'rxjs';
import { By } from 'selenium-webdriver';


 describe('CnhCollapsibleComponent', () => {
  let component: CnhCollapsibleComponent;
  let fixture: ComponentFixture<CnhCollapsibleComponent>;
  class MockDataAccessClientsService {
    getUserCompanyId() {
      '5934kngkgflg';
    }
  }

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      declarations: [
        CnhCollapsibleComponent
      ],
      providers: [
        { provide: DataAccessClientsService, useClass: MockDataAccessClientsService },
       ]
    }).compileComponents();
  }));

   beforeEach(() => {
    fixture = TestBed.createComponent(CnhCollapsibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('should create', () => {
    expect(component).toBeTruthy();
  });


 });
