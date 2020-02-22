import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EventsService } from '@services/events/events.service';
import { Subscription, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WordWrapTooltipComponent } from '@shared-components/word-wrap-tooltip/word-wrap-tooltip.component';

@Directive({
  selector: '[appWordWrapTooltip]'
})
export class WordWrapTooltipDirective implements OnInit, OnDestroy {
  @Input() public tooltipContent: string;
  private overlayRef: OverlayRef;
  private _wordWrapEventSub: Subscription;
  private _currentId = Date.now();

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private _eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this._wordWrapEventSub = this._eventsService.wordWrapTooltip$
      .pipe(filter(id => (this._currentId === id ? false : true)))
      .subscribe(() => this.destroy());
  }

  ngOnDestroy() {
    this.destroy();
    this._wordWrapEventSub.unsubscribe();
  }
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: any) {
    if (this.overlayRef) {
      return;
    }

    const { target } = event;
    if (!((<HTMLElement>target).childNodes.length > 1)) {
      if ((<HTMLElement>target).offsetWidth < (<HTMLElement>target).scrollWidth) {
        this.createTooltipComponent();
      }
      return;
    }

    if (
      (<HTMLElement>(<HTMLElement>target).firstChild).offsetWidth <
      (<HTMLElement>(<HTMLElement>target).firstChild).scrollWidth
    ) {
      this.createTooltipComponent();
    }
  }

  @HostListener('mouseleave')
  mouseout() {
    this.destroy();
  }

  @HostListener('press', ['$event'])
  onMouseDown(event: any) {
    if (this.overlayRef) {
      return;
    }

    const { target } = event;
    if (!((<HTMLElement>target).childNodes.length > 1)) {
      if ((<HTMLElement>target).offsetWidth < (<HTMLElement>target).scrollWidth) {
        this.createAndDestroyTooltip();
      }
      return;
    }

    if (
      (<HTMLElement>(<HTMLElement>target).firstChild).offsetWidth <
      (<HTMLElement>(<HTMLElement>target).firstChild).scrollWidth
    ) {
      this.createAndDestroyTooltip();
    }
  }
  createTooltipComponent() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX: 5,
          offsetY: -8
        }
      ]);
    this.overlayRef = this.overlay.create({ positionStrategy });

    const tooltipPortal = new ComponentPortal(WordWrapTooltipComponent);

    // Attach tooltip portal to overlay
    const tooltipRef: ComponentRef<WordWrapTooltipComponent> = this.overlayRef.attach(
      tooltipPortal
    );

    // Pass content to tooltip component instance
    tooltipRef.instance.text = this.tooltipContent;
  }

  createAndDestroyTooltip() {
    this.createTooltipComponent();

    this._eventsService.wordWrapTooltipId(this._currentId);

    timer(1500)
      .pipe(filter(() => (this.overlayRef ? true : false)))
      .subscribe(() => this.destroy());
  }
  private destroy(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }

    this.overlayRef = null;
  }
}
