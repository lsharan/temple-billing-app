import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { Devotee, DevoteeService } from '../../services/devotee.service';
import { DevoteeDialogComponent } from '../devotee-dialog/devotee-dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-devotee-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './devotee-management.html',
  styleUrls: ['./devotee-management.css']
})
export class DevoteeManagementComponent implements OnInit {
  private devoteeService = inject(DevoteeService);
  private dialog = inject(MatDialog);

  devotees$: Observable<Devotee[]> = of([]);
  loading$: Observable<boolean> = of(true);
  displayedColumns: string[] = ['name', 'phone', 'gotra', 'nakshatra', 'actions'];

  ngOnInit(): void {
    this.loadDevotees();
  }

  loadDevotees(): void {
    const devoteesData$ = this.devoteeService.getDevotees().pipe(
      catchError(error => {
        console.error('Error fetching devotees:', error);
        return of([]);
      })
    );
    this.loading$ = devoteesData$.pipe(map(() => false), startWith(true));
    this.devotees$ = devoteesData$;
  }

  openDevoteeDialog(devotee?: Devotee): void {
    const dialogRef = this.dialog.open(DevoteeDialogComponent, {
      width: '400px',
      data: { devotee: devotee || null },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (devotee && devotee.id) {
          this.devoteeService.updateDevotee(devotee.id, result).catch(console.error);
        } else {
          this.devoteeService.addDevotee(result).catch(console.error);
        }
      }
    });
  }

  deleteDevotee(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this devotee?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.devoteeService.deleteDevotee(id).catch(console.error);
      }
    });
  }
}
