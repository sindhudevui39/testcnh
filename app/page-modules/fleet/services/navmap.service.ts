import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavmapService {
  showMap: any = false;
  selectedOption: any;
  mapFirstLoad: any;
  constructor() { }
}
