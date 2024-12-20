import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-reservation-list',
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  activatedRoute: any;

  constructor(private reservationService: ReservationService, 
  private router: Router) {}

  ngOnInit(): void
   {
    this.reservations = this.reservationService.getReservations();
  
  }

  deleteReservation(id: string): void 
  {
    if (confirm('Are you sure you want to delete this reservation?')) 
      {
      this.reservationService.deleteReservation(id);
      this.reservations = this.reservationService.getReservations(); 
    }
  }
}
