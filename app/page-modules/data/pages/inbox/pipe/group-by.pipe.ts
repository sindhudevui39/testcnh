import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tcGroupBy'
})
export class GroupByPipe implements PipeTransform {
  public transform(value: any[], filter?: string): any {
    if (!filter) {
      return value;
    }
    let res: any = (value || []).reduce((prev, cur) => {
      return this.addAsArray(prev, cur[filter], cur);
    }, []);
    res = Object.keys(res).map(key => ({ key, value: res[key] }));
    return res;
  }

  private addAsArray(obj: any, property: string, value: any): any {
    Array.isArray(obj[property])
      ? obj[property].push(value)
      : (obj[property] = [value]);
    return obj;
  }
}
