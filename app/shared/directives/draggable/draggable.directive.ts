import {
  Directive,
  ElementRef,
  AfterViewInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';

import * as Muuri from 'muuri';
import { Widgets } from '@dashboard/utils/db-widgets.enum';
import { EventsService } from '@services/events/events.service';

const muuriOptions = {
  dragEnabled: true,
  dragReleaseDuration: 400,
  dragReleaseEasing: 'ease',
  dragSortPredicate: {
    threshold: 50,
    action: 'swap'
  },
  dragStartPredicate: {
    handle: '.card-header-item'
  },
  layout: {
    fillGaps: true
  },
  layoutDuration: 400,
  layoutEasing: 'ease',
  layoutOnInit: true
};

export interface MuuriEvent {
  type: string;
  items: any;
}

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements AfterViewInit, OnDestroy {
  componentLoadedSubject;

  @Output()
  layoutUpdated = new EventEmitter();

  private _board: Muuri;
  private _boardInitialized = false;

  private _dragStarted = false;
  private _swapIndex = -1;

  constructor(private el: ElementRef, private eventsService: EventsService) {}

  ngAfterViewInit() {
    this.componentLoadedSubject = this.eventsService._componentsLoaded.subscribe(
      (loaded: boolean) => {
        if (loaded) {
          this._board = new Muuri(this.el.nativeElement, muuriOptions);

          this._board.layout(true);

          if (!this._boardInitialized) {
            const muuriEvent: MuuriEvent = {
              type: 'init',
              items: this._board.getItems()
            };

            this.layoutUpdated.emit(muuriEvent);

            this._boardInitialized = true;
          }

          /**
           * Muuri events setup
           */
          this._board.on('layoutEnd', items => {
            const lastIndex = items.length - 1;

            if (items.length > 0 && items[lastIndex]._element.id !== Widgets.ADD_WIDGET_BUTTON) {
              items.forEach((item, index) => {
                if (item._element.id === Widgets.ADD_WIDGET_BUTTON) {
                  this._swapIndex = index;
                }
              });
            }
          });

          this._board.on('dragInit', (item, event) => {
            if (event.target.className !== 'card-more') {
              this._dragStarted = true;
            }
          });

          this._board.on('dragReleaseEnd', item => {
            if (this._swapIndex > -1) {
              this._board.move(this._swapIndex, -1, { action: 'swap' });

              this._swapIndex = -1;
            } else if (this._dragStarted) {
              const muuriEvent: MuuriEvent = {
                type: 'save',
                items: this._board.getItems()
              };

              this.layoutUpdated.emit(muuriEvent);
            }

            this._dragStarted = false;
          });
        }
      }
    );
  }

  ngOnDestroy() {
    this.componentLoadedSubject.unsubscribe();
  }

  @Input()
  set widgetToAdd(el: HTMLElement) {
    if (el) {
      const index = this.getBoardLength() - 1;

      this._board.add(el, { index });
      this._board.synchronize();

      const muuriEvent: MuuriEvent = {
        type: 'save',
        items: this._board.getItems()
      };

      this.layoutUpdated.emit(muuriEvent);
    }
  }

  @Input()
  set widgetToRemove(event: EventEmitter<string>) {
    event.subscribe((id: string) => this.removeWidget(id));
  }

  removeWidget(id) {
    if (id) {
      const element = this._board._items.find(item => {
        return item._element.id === id;
      });

      if (element) {
        this._board.remove(element, { removeElements: true });
        this._board.synchronize();

        const muuriEvent: MuuriEvent = {
          type: 'save',
          items: this._board.getItems()
        };

        this.layoutUpdated.emit(muuriEvent);
      }
    }
  }

  getBoardLength() {
    return this._board.getItems().length;
  }
}
