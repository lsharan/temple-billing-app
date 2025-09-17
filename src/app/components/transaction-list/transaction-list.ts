import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Transaction, TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './transaction-list.html',
})
export class TransactionListComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private fb = inject(FormBuilder);

  transactions$: Observable<Transaction[]> = of([]);
  displayedColumns: string[] = ['transactionDate', 'sevaName', 'devoteeName', 'amount', 'paymentMethod'];
  filterForm!: FormGroup;
  totalRevenue$: Observable<number> = of(0);

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
    });

    const allTransactions$ = this.transactionService.getTransactions().pipe(
      map(transactions => transactions.map(t => ({
        ...t,
        transactionDate: (t.transactionDate as any).toDate ? (t.transactionDate as any).toDate() : new Date(t.transactionDate)
      })))
    );

    this.transactions$ = combineLatest([
      allTransactions$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([transactions, filter]) => {
        let filteredTransactions = transactions;
        if (filter.startDate) {
          filteredTransactions = filteredTransactions.filter(t => t.transactionDate >= filter.startDate);
        }
        if (filter.endDate) {
          const endDate = new Date(filter.endDate);
          endDate.setHours(23, 59, 59, 999); // Include the whole end day
          filteredTransactions = filteredTransactions.filter(t => t.transactionDate <= endDate);
        }
        return filteredTransactions;
      })
    );

    this.totalRevenue$ = this.transactions$.pipe(
      map(transactions => transactions.reduce((sum, t) => sum + t.amount, 0))
    );
  }
}
