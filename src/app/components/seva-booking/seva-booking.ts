import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

// Services and Interfaces
import { SevaService } from '../../services/seva.service';
import { Devotee, DevoteeService } from '../../services/devotee.service';
import { TransactionService } from '../../services/transaction.service';

// Standalone component imports
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Seva } from '../../models/seva.model';
import { DevoteeDialogComponent } from '../devotee-dialog/devotee-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-seva-booking',
  templateUrl: './seva-booking.html', // <-- Corrected path
  styleUrls: ['./seva-booking.css'],   // <-- Corrected path
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule
  ]
})
export class SevaBookingComponent implements OnInit {
  bookingForm: FormGroup;
  sevas$: Observable<Seva[]>;
  allDevotees: Devotee[] = [];
  filteredDevotees$: Observable<Devotee[]>;

  paymentMethods = ['Cash_Account', 'Bank_Account', 'UPI']; // Using the Account IDs
  saving = false;

  constructor(
    private fb: FormBuilder,
    private sevaService: SevaService,
    private devoteeService: DevoteeService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.bookingForm = this.fb.group({
      devotee: ['', Validators.required], // Changed from devoteeId
      sevaId: ['', Validators.required],
      sevaDate: [new Date(), Validators.required],
      paymentMethod: ['', Validators.required],
      gotra: [''],
      nakshatra: ['']
    });

    this.sevas$ = this.sevaService.getSevas();
    this.devoteeService.getDevotees().subscribe(devotees => {
      this.allDevotees = devotees;
    });

    this.filteredDevotees$ = this.bookingForm.get('devotee')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filterDevotees(name) : this.allDevotees.slice()))
    );
  }

  private _filterDevotees(name: string): Devotee[] {
    const filterValue = name.toLowerCase();
    return this.allDevotees.filter(devotee => devotee.name.toLowerCase().includes(filterValue));
  }

  displayDevotee(devotee: Devotee): string {
    return devotee && devotee.name ? devotee.name : '';
  }

  ngOnInit(): void {
    // When a devotee is selected, auto-fill their gotra and nakshatra
    this.bookingForm.get('devotee')?.valueChanges.subscribe(devotee => {
      if (typeof devotee !== 'string') {
        this.bookingForm.patchValue({
          gotra: devotee.gotra,
          nakshatra: devotee.nakshatra
        }, { emitEvent: false });
      }
    });
  }

  openNewDevoteeDialog(): void {
    const dialogRef = this.dialog.open(DevoteeDialogComponent, {
      width: '400px',
      data: { devotee: null } // Open in "add new" mode
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          const newDevoteeRef = await this.devoteeService.addDevotee(result);
          // Fetch the newly created devotee to set it in the form
          const newDevotee = await firstValueFrom(this.devoteeService.getDevotee(newDevoteeRef.id));
          this.bookingForm.patchValue({ devotee: newDevotee });
          this.snackBar.open('New devotee added successfully!', 'Close', { duration: 3000 });
        } catch (error) {
          console.error("Error adding new devotee:", error);
          this.snackBar.open('Failed to add new devotee.', 'Close', { duration: 5000 });
        }
      }
    });
  }

  async onSaveBooking(): Promise<void> {
    console.log('Save booking clicked');
    if (this.bookingForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      console.warn('Booking form invalid:', this.bookingForm.value, this.bookingForm.errors);
      return;
    }

    this.saving = true;
    const formValue = this.bookingForm.value;
    const devoteeId = formValue.devotee.id; // Get ID from devotee object

    if (!devoteeId) {
      this.snackBar.open('Please select a valid devotee.', 'Close', { duration: 3000 });
      this.saving = false;
      return;
    }

    let selectedSeva: Seva | undefined;
    try {
      console.log('fetching sevas')
      // Use the modern `firstValueFrom` to convert the observable to a promise.
      selectedSeva = await firstValueFrom(this.sevaService.getSeva(formValue.sevaId));
      console.log('Selected seva:', selectedSeva);
    } catch (err) {
      console.error('Error fetching seva:', err);
      this.snackBar.open('Error fetching seva details.', 'Close', { duration: 3000 });
      this.saving = false;
      return;
    }

    if (!selectedSeva) {
      this.snackBar.open('Could not find selected Seva. Please try again.', 'Close', { duration: 3000 });
      console.warn('Selected seva not found for sevaId:', formValue.sevaId);
      this.saving = false;
      return;
    }

    const newTransaction = {
      transactionDate: new Date(),
      sevaId: formValue.sevaId,
      devoteeId: devoteeId,
      sevaName: selectedSeva.name, // Add Seva Name
      devoteeName: formValue.devotee.name, // Add Devotee Name
      amount: selectedSeva.price,
      paymentMethod: formValue.paymentMethod,
      sevaDate: formValue.sevaDate.toISOString().split('T')[0],
      gotra: formValue.gotra,
      nakshatra: formValue.nakshatra,
      debitAccount: formValue.paymentMethod,
    };

    try {
      console.log('Attempting to add transaction:', newTransaction);
      await this.transactionService.addTransaction(newTransaction);
      this.snackBar.open('Seva booked successfully!', 'Close', { duration: 3000 });
      this.bookingForm.reset({ sevaDate: new Date() });
      console.log('Booking successful:', newTransaction);
    } catch (error) {
      console.error("Error booking seva:", error);
      this.snackBar.open('Failed to book seva. Please check the console.', 'Close', { duration: 5000 });
    } finally {
      this.saving = false;
    }
  }

  onSave(): void {
    this.onSaveBooking();
  }
}
