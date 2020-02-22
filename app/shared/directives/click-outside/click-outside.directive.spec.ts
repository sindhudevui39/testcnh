import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `<input type="text" appClickOutside (clickOutside)=hide()>
  <button class="clickme"></button>`
})
class TestClickOutsideDirComponent {
  hideMe = false;
  hide() {
    this.hideMe = true;
  }
}
describe('Directive: ClickOutsideDirective', () => {
  let component: TestClickOutsideDirComponent;
  let fixture: ComponentFixture<TestClickOutsideDirComponent>;
  let inputEl: DebugElement;
  let divEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClickOutsideDirective, TestClickOutsideDirComponent]
    });
    fixture = TestBed.createComponent(TestClickOutsideDirComponent);
    component = fixture.componentInstance;
    divEl = fixture.debugElement.query(By.css('button'));
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should set hideMe to true on click of div', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(component.hideMe).toBe(true);
  });

  it('should return hideMe as false on click of input', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.click();
    fixture.detectChanges();
    expect(component.hideMe).toBe(false);
  });
});
