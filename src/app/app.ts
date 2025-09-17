import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // <-- Add for router-outlet and routerLink
    MatToolbarModule, // <-- Add for mat-toolbar
    MatButtonModule // <-- Add for mat-button
  ],
  templateUrl: './app.component.html', // <-- Corrected path
  styleUrls: ['./app.component.scss']  // <-- Corrected path
})
export class AppComponent {
  title = 'temple-billing-app';
}
