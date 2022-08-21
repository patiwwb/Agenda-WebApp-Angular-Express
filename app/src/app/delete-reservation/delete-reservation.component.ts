import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from '../availability.service';
import { Availability } from '../Availability';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../Reservation';

@Component({
  selector: 'app-delete-reservation',
  templateUrl: './delete-reservation.component.html',
  styleUrls: ['./delete-reservation.component.css']
})
export class DeleteReservationComponent implements OnInit {

  public successMsg: string;
  public errorMsg: string;
  reservationDate: string;
  start: string;
  end: string;
  email : string;

  constructor(private availabilityService : AvailabilityService, private reservationService : ReservationService) { }

  ngOnInit() {
  }

  checkTimeValid(time){
    //console.log(parseInt(time.split("h")[1]),parseInt(time.split("h")[0]));
    if (time.includes("h") == false || time.length > 5 || time.length < 4 || parseInt(time.split("h")[1])<0 || parseInt(time.split("h")[0]) < 0 || parseInt(time.split("h")[0]) > 24 || parseInt(time.split("h")[1]) > 60 || parseInt(time.split("h")[1]) == NaN || parseInt(time.split("h")[0]) == NaN )
    {
      console.log("please enter valid time");
      return false;
    }
    if( (parseInt(time.split("h")[1])) == 0 && parseInt(time.split("h")[0]) == 0){
      console.log("please enter valid time");
      return false;
    }
    return true;
  }

  validateEmail(email) 
  {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
  }

  deleteReservation() {

    if(this.checkTimeValid(this.start) == false || this.checkTimeValid(this.end) == false){
      this.errorMsg = "Please select a valid start and end hour (00h00 format)";
      return;
    }

    if(this.validateEmail(this.email)==false){
      this.errorMsg = "Please enter valid email";
      return;
    }

    var previousDate = this.reservationDate;
    var previousStart = this.start;
    var previousEnd = this.end;

    this.successMsg = '';
    this.errorMsg = '';
    var resD = new Date(this.reservationDate);
    // console.log(this.email, resD.toISOString(), this.start, this.end);
    // this.reservationService.cancelReservation2(this.email, resD.toISOString(), this.start, this.end).subscribe(res => console.log(res));
    this.reservationService.cancelReservation2(this.email, resD.toISOString(), this.start, this.end)
    .subscribe((res : any) => {
      this.reservationDate = '';
      this.start = '';
      this.end = '';
      this.email = "";
      this.successMsg = `Reservation the ${resD} cancelled `;
    },
    (error: ErrorEvent) => {
      this.errorMsg = error.error.message;
    });

    this.successMsg = '';
    this.errorMsg = '';
    this.availabilityService.createAvailability(previousDate, previousStart, previousEnd)
      .subscribe((createdAvailability: Availability) => {
        previousDate = '';
        previousStart = '';
        previousEnd = '';
        const availabilityDate = new Date(createdAvailability.availabilityDate).toDateString();
        // this.successMsg = `Availability Created Successfully for ${availabilityDate}`;
      },
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
      });
    // window.location.reload();
  }




}
