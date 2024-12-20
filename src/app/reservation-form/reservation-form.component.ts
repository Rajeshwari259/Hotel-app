import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  errorMessage: string = '';
  reservationId: any;

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void 
  {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');

  if (this.reservationId) 
  {
    const reservation = this.reservationService.getReservation(this.reservationId);
    if (reservation)
   {
      this.reservationForm.patchValue(reservation);
    } else {
      this.errorMessage = 'Reservation not found.';
    }
  } 
  }

  
  validateDates(): boolean 
  {
    const checkIn = new Date(this.reservationForm.value.checkInDate);
    const checkOut = new Date(this.reservationForm.value.checkOutDate);
    return checkOut >= checkIn;
  }


  checkRoomAvailability(): boolean {
    const roomNumber = this.reservationForm.value.roomNumber;
    const checkInDate = this.reservationForm.value.checkInDate;
    const checkOutDate = this.reservationForm.value.checkOutDate;
  
    const id = this.reservationId; 
    return this.reservationService.getReservations().some((reservation) => 
      {
      const existingCheckIn = new Date(reservation.checkInDate);
      const existingCheckOut = new Date(reservation.checkOutDate);
  
   
      if (reservation.id === id) 
      {
        return false;
      }
  
   
      return (
        reservation.roomNumber === roomNumber &&
        new Date(checkInDate) < existingCheckOut &&
        new Date(checkOutDate) > existingCheckIn
      );
    });
  }
  
  onSubmit(): void {
    if (this.reservationForm.valid) {
      if (!this.validateDates()) {
        this.errorMessage = 'Check-out date should not before check-in ';
        return;
      }

      if (this.checkRoomAvailability()) {
        this.errorMessage = 'This room is already booked for the selected dates.';
        return;
      }

      const reservation: Reservation = this.reservationForm.value;

      const id = this.activatedRoute.snapshot.paramMap.get('id');

      if (id) {
        this.reservationService.updateReservation(id, reservation);
      } else {
        this.reservationService.addReservation(reservation);
      }

      this.router.navigate(['/list']);
    }
  }
}
