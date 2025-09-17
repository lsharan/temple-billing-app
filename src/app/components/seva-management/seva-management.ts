import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { Seva } from '../../models/seva.model';
import { SevaService } from '../../services/seva.service';
import { SevaDialogComponent } from '../seva-dialog/seva-dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-seva-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './seva-management.html',
  styleUrls: ['./seva-management.css']
})
export class SevaManagementComponent implements OnInit {
  private sevaService = inject(SevaService);
  private dialog = inject(MatDialog);

  sevas$: Observable<Seva[]> = of([]);
  loading$: Observable<boolean> = of(true);
  displayedColumns: string[] = ['name', 'price', 'templeShare', 'priestShare', 'active', 'actions'];

  ngOnInit(): void {
    this.loadSevas();
  }

  loadSevas(): void {
    const sevasData$ = this.sevaService.getSevas().pipe(
      catchError(error => {
        console.error('Error fetching sevas:', error);
        return of([]);
      })
    );
    this.loading$ = sevasData$.pipe(map(() => false), startWith(true));
    this.sevas$ = sevasData$;
  }

  openSevaDialog(seva?: Seva): void {
    const dialogRef = this.dialog.open(SevaDialogComponent, {
      width: '400px',
      data: { seva: seva || null },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (seva && seva.id) {
          this.sevaService.updateSeva(seva.id, result).catch(console.error);
        } else {
          this.sevaService.addSeva(result).catch(console.error);
        }
      }
    });
  }

  deleteSeva(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this seva?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sevaService.deleteSeva(id).catch(console.error);
      }
    });
  }
}