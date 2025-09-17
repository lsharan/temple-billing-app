import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-seva-booking-dialog',
  templateUrl: './seva-booking-dialog.html'
})
export class SevaBookingDialogComponent {
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SevaBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.bookingForm = this.fb.group({
      // ...your form controls and validators...
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bookingForm.valid) {
      this.dialogRef.close(this.bookingForm.value);
    }
  }
}
