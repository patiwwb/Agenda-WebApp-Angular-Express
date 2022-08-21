import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from '../availability.service';
import { Availability } from '../Availability';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {

  public successMsg: string;
  public errorMsg: string;
  availabilityDate: string;
  start: string;
  end: string;

  constructor(private availabilityService : AvailabilityService) { }

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

  createAvailability() {

    if(this.checkTimeValid(this.start) == false || this.checkTimeValid(this.end) == false){
      this.errorMsg = "Please select a valid start and end hour (00h00 format)";
      return;
    }

    this.successMsg = '';
    this.errorMsg = '';
    this.availabilityService.createAvailability(this.availabilityDate, this.start, this.end)
      .subscribe((createdAvailability: Availability) => {
        this.availabilityDate = '';
        this.start = '';
        this.end = '';
        const availabilityDate = new Date(createdAvailability.availabilityDate).toDateString();
        this.successMsg = `Availability Created Successfully for ${availabilityDate}`;
      },
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
      });
      // window.location.reload();
  }

}
