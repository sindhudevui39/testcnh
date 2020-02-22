import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FleetUrls } from '../fleet-api/fleet-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class FleetVehicleSelectService {
  constructor(private http: HttpClient) {}

  public postVehicles(userVehicles): Observable<any> {
    return this.http
      .post(`${FleetUrls.FLEET_POST_VEHICLES}`, userVehicles, {
        responseType: 'text',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        map(text => {
          try {
            return JSON.parse(text);
          } catch (_) {
            return text;
          }
        })
      );
  }
}
