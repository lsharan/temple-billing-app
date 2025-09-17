import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Seva } from '../../models/seva.model';
import { MyErrorStateMatcher } from '../../core/error-state-matcher';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-seva-dialog',
  templateUrl: './seva-dialog.html',
  styleUrls: ['./seva-dialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,    // <-- For [formGroup]
    MatDialogModule,
    MatFormFieldModule,     // <-- For mat-form-field and mat-label
    MatInputModule,         // <-- For matInput
    MatButtonModule,        // <-- For mat-button
    MatSlideToggleModule    // <-- For mat-slide-toggle
  ]
})
export class SevaDialogComponent implements OnInit {
  sevaForm: FormGroup;
  isEditMode: boolean;
  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SevaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { seva: Seva }
  ) {
    this.isEditMode = !!data.seva?.id;
    this.sevaForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      templeShare: [0, [Validators.required, Validators.min(0)]],
      priestShare: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.sevaForm.patchValue(this.data.seva);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.sevaForm.valid) {
      this.dialogRef.close(this.sevaForm.value);
    }
  }
}