import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone:true,
  imports:[RouterModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router)
  {}

  navigateToNew() 
  {
    this.router.navigate(['/new']);
  }
  navigateToList() 
  {
    this.router.navigate(['/list']);
  }

}
