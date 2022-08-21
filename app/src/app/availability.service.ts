import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Availability } from './Availability';
import { Reservation} from './Reservation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getAvailabilities(): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.BASE_URL}/availabilities`);
  }

  createAvailability(availabilityDate: string, start: string, end: string): Observable<Availability> {
    return this.http.post<Availability>(`${this.BASE_URL}/availabilities`, { availabilityDate, start, end });
  }

  cancelAvailability(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/availabilities/${id}`);
  }

  createReservations(reservationDate: string, start: string, end: string, title: string, email: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/reservations`, { reservationDate, start, end, title, email });
  }

  bookAvailability(id: string,reservationDate: string, start: string, end: string, title:string, email:string){ 
    this.createReservations(reservationDate,start,end,title,email );
  }


}
