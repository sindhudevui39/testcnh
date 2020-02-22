import { async, TestBed } from '@angular/core/testing';

import { WordWrapTooltipComponent } from './word-wrap-tooltip.component';

describe('WordWrapTooltipComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WordWrapTooltipComponent]
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(WordWrapTooltipComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
