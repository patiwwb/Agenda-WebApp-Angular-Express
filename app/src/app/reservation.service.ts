import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation} from './Reservation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient) { }
  
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.BASE_URL}/reservations`);
  }

  createReservations(reservationDate: string, start: string, end: string, title: string, email: string): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.BASE_URL}/reservations`, { reservationDate, start, end, title, email });
  }

  cancelReservation(id: string, email : string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/reservations/${id}/${email}`);
  }

  cancelReservation2(email:string, reservationDate:string, start:string, end:string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/reservations/${email}/${reservationDate}/${start}/${end}`);
  }

}
