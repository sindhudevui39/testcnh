import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnhHighlight'
})
export class CnhHighlightPipe implements PipeTransform {
  private static className: string;

  public constructor() {
    CnhHighlightPipe.className = 'search-highlight';
    // Empty
  }

  public transform(sentence?: string, highlightWord?: string): any {
    // Both arguments must be defined, not null and be of type string
    if (
      ![sentence, highlightWord].every(
        (arg?: string): boolean => 'string' === typeof arg
      )
    ) {
      return sentence as any;
    }

    const regex: RegExp = new RegExp(highlightWord.trim(), 'i');
    const found: RegExpMatchArray | null = sentence.trim().match(regex);

    return (found
      ? sentence.replace(
          regex,
          `<span class="${CnhHighlightPipe.className}">${found[0]}</span>`
        )
      : sentence) as string;
  }
}
