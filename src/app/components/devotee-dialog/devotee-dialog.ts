import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Devotee } from '../../services/devotee.service';

@Component({
  selector: 'app-devotee-dialog',
  templateUrl: './devotee-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class DevoteeDialogComponent {
  devoteeForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DevoteeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { devotee: Devotee }
  ) {
    this.isEditMode = !!data.devotee;
    this.devoteeForm = this.fb.group({
      name: [data.devotee?.name || '', Validators.required],
      phone: [data.devotee?.phone || '', Validators.required],
      gotra: [data.devotee?.gotra || ''],
      nakshatra: [data.devotee?.nakshatra || ''],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.devoteeForm.valid) {
      this.dialogRef.close(this.devoteeForm.value);
    }
  }
}
