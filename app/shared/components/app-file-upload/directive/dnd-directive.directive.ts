import {
  Directive,
  HostListener,
  HostBinding,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Directive({
  selector: '[appDndDirective]'
})
export class DndDirectiveDirective {
  @Input() private allowed_extensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @Output() private filesInvalidEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @HostBinding('style.background') private background = '#eee';

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    const files = evt.dataTransfer.files;
    const valid_files: Array<any> = [];
    const invalid_files: Array<any> = [];
    if (files.length > 0) {
      Array.from(files).forEach(file => {
        const ext = file['name'].split('.')[file['name'].split('.').length - 1];
        if (this.allowed_extensions.lastIndexOf(ext) !== -1) {
          valid_files.push(file);
        } else {
          invalid_files.push(file);
        }
      });
      this.filesChangeEmiter.emit(valid_files);
      this.filesInvalidEmiter.emit(invalid_files);
    }
  }
}
