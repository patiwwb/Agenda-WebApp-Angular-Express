import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { AvailabilityListComponent } from './availability-list/availability-list.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';

import { AuthGuard } from './auth.guard';
import { DeleteReservationComponent } from './delete-reservation/delete-reservation.component';


const routes: Routes = [
  { path: '' , redirectTo:'/login', pathMatch:'full'},
  { path: 'login' , component: LoginComponent},
  { path: 'logout', component: LogoutComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'availability-list',
    component: AvailabilityListComponent,
  },
  {
    path: 'delete-reservation',
    component: DeleteReservationComponent,
  },
  {
    path: 'reservation-list',
    component: ReservationListComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
