import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from '../availability.service';
import { Availability } from '../Availability';
import { mergeMap, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availability-list',
  templateUrl: './availability-list.component.html',
  styleUrls: ['./availability-list.component.css']
})
export class AvailabilityListComponent implements OnInit {

  public admin : boolean = false;
  public href: string = "";
  public loading = true;
  public errorMsg: string;
  public successMsg: string;
  public availabilities: Availability[];
  public columns = ['availabilityDate', 'start', 'end', 'cancel'];
  public columns2 = ['availabilityDate', 'start', 'end' , 'book'];
  public title : string = "";
  public email : string = "";
  public time : string = "";

  constructor(private availabilityService : AvailabilityService,private router: Router) { }

  ngOnInit() {
    this.href = this.router.url;
    // console.log(this.href.split('/'))
    if( (this.href.split('/'))[1] == 'home'){
      this.admin = true;
    }
    // console.log(this.admin);
    this.availabilityService.getAvailabilities()
      .subscribe((availabilities: Availability[]) => {
        this.availabilities = availabilities;
        this.loading = false;
      },
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
        this.loading = false;
      });
      setTimeout(() => { this.ngOnInit() }, 1000 );
  }

  cancelAvailability(id: string) {
    this.availabilityService.cancelAvailability(id)
      .pipe(
        mergeMap(() => this.availabilityService.getAvailabilities())
      )
      .subscribe((availabilities: Availability[]) => {
        this.availabilities= availabilities;
        this.successMsg = 'Successfully cancelled availability';
      },
      (error: ErrorEvent) => {
        this.errorMsg = error.error.message;
      });
  }

  createReservations(reservationDate: string, start: string, end: string, title: string, email: string){
    this.availabilityService.createReservations(reservationDate,start,end,title,email)
    .subscribe(res => console.log(res));
  }

  createAvailability(availabilityDate: string, start: string, end: string){
    this.availabilityService.createAvailability(availabilityDate,start,end)
    .subscribe(res => console.log(res));
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

  bookAvailability(id: string,reservationDate: string, start: string, end: string, title:string, email:string,time : string){
    
    if(this.validateEmail(email) == false){
      this.errorMsg = "Please enter a valid email";
      return;
    }

    if (this.checkTimeValid(time) == false ){
      this.errorMsg = "Please select a valid duration time";
      return;
    }
    if(title =="" || email == "" || time == ""){
      console.log("please enter title, email and time");
      return;
    }
    if(title != "" && email != "" && time!=""){

      var hourDiff = parseInt(end.split("h")[0]) - parseInt(start.split("h")[0]);
      var minDiff = parseInt(end.split("h")[1]) - parseInt(start.split("h")[1]);

      hourDiff = Math.round(hourDiff + minDiff/60)
      minDiff = minDiff%60

      console.log(hourDiff,minDiff);
    

      if(parseInt(time.split("h")[0]) == hourDiff && parseInt(time.split("h")[1]) == minDiff){
        this.createReservations(reservationDate ,start  ,end , title, email); 
        this.cancelAvailability(id);
        this.successMsg = 'Successfully booked a reservation';
        return;
      }
      if(parseInt(time.split("h")[0]) > hourDiff || (parseInt(start.split("h")[0]) + parseInt(time.split("h")[0])) > 24 ){
        this.errorMsg = "Please select a valid duration time"
        return;
      }
      else{
        var hourEnd =Math.floor(parseInt(start.split("h")[0]) + parseInt(time.split("h")[0]) + (parseInt(start.split("h")[1]) + parseInt(time.split("h")[1]))/60 ).toString();
        var minEnd = ((parseInt(start.split("h")[1]) + parseInt(time.split("h")[1]))%60).toString();

        var hourEnd = this.format2digits(Math.floor(parseInt(start.split("h")[0]) + parseInt(time.split("h")[0]) + (parseInt(start.split("h")[1]) + parseInt(time.split("h")[1]))/60 ));
        var minEnd = this.format2digits((parseInt(start.split("h")[1]) + parseInt(time.split("h")[1]))%60);  
        
        if( parseInt(hourEnd) > (parseInt(end.split("h")[0])) &&  parseInt(minEnd) > (parseInt(end.split("h")[1])) )
        {
          this.errorMsg = "Not enough time in this slot"
          return;
        }


        var resEnd = hourEnd + "h" + minEnd;
        console.log(hourEnd,minEnd);
        this.createReservations(reservationDate ,start  ,resEnd , title, email); 
        this.cancelAvailability(id);
        if(resEnd != end ){
          console.log("diff",resEnd,end);
          this.createAvailability(reservationDate,resEnd,end);
        }
        setTimeout(() => {  this.successMsg = 'Successfully booked a reservation'; }, 5000 );
       
      }

    }

    
  }


  
  refresh() {
    window.location.reload();
 }

  format2digits(n){
  return n > 9 ? "" + n: "0" + n;
}

}
