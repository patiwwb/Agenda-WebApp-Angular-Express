import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../Reservation';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  public loading = true;
  public errorMsg: string;
  public successMsg: string;
  public reservations: Reservation[];
  public columns = ['reservationDate', 'start', 'end', 'title', 'email', 'link', 'cancel'];




  constructor(private reservationService: ReservationService) { }

  ngOnInit() {
    this.reservationService.getReservations()
      .subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
        this.loading = false;
      },
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
        this.loading = false;
      });
      setTimeout(() => { this.ngOnInit() }, 1000 );
  }

  cancelReservation(id: string, email: string) {

    this.reservationService.cancelReservation(id,email)
      .pipe(
        mergeMap(() => this.reservationService.getReservations())
      )
      .subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
        this.successMsg = 'Successfully cancelled reservations';
      },
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
      });

      
  }

}
