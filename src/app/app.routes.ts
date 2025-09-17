// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

// Import your components
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { RegisterComponent } from './components/register/register';
import { SevaManagementComponent } from './components/seva-management/seva-management';
import { DevoteeManagementComponent } from './components/devotee-management/devotee-management';
import { SevaBookingComponent } from './components/seva-booking/seva-booking';
import { BillingComponent } from './components/billing/billing.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'manage-sevas', component: SevaManagementComponent },
  { path: 'book-seva', component: SevaBookingComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'seva-booking', component: SevaBookingComponent },
  { path: 'manage-devotees', component: DevoteeManagementComponent },
  { path: 'transactions', component: TransactionListComponent },

  // Set the default route to the billing page
  { path: '', redirectTo: '/billing', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/billing' } // Redirect any other path to billing
];