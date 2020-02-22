import { Injectable } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FleetUserPreferencesService {
  public userPreferences = new BehaviorSubject(null);

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.apiService.getFleetUserPreferences().subscribe(data => {
      if (data) {
        this.userPreferences.next(data);
      }
    });
  }

  updateUserPreferences(data: any): Observable<any> {
    const url = 'https://euevoapipv010.azure-api.net/mkt/fleet-restapi/user-preferences';
    return this.http.put(url, data);
  }
}
