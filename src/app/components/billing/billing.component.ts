import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Seva } from '../../models/seva.model';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  sevaControl = new FormControl();
  allSevas: Seva[] = [
    { id: '1', name: 'Archana', price: 20, templeShare: 15, priestShare: 5, description: '', active: true },
    { id: '2', name: 'Abhishekam', price: 101, templeShare: 71, priestShare: 30, description: '', active: true },
    { id: '3', name: 'Special Pooja', price: 251, templeShare: 201, priestShare: 50, description: '', active: true },
  ];
  filteredSevas!: Observable<Seva[]>;
  
  billedSevas: Seva[] = [];
  displayedColumns: string[] = ['name', 'price', 'actions'];
  totalAmount = 0;

  ngOnInit() {
    this.filteredSevas = this.sevaControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.allSevas.slice()))
    );
  }

  private _filter(name: string): Seva[] {
    const filterValue = name.toLowerCase();
    return this.allSevas.filter(seva => seva.name.toLowerCase().includes(filterValue));
  }

  displaySeva(seva: Seva): string {
    return seva && seva.name ? seva.name : '';
  }

  addSeva(seva: Seva) {
    this.billedSevas = [...this.billedSevas, seva];
    this.calculateTotal();
    this.sevaControl.setValue('');
  }

  removeSeva(sevaToRemove: Seva) {
    this.billedSevas = this.billedSevas.filter(seva => seva.id !== sevaToRemove.id);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.billedSevas.reduce((acc, seva) => acc + seva.price, 0);
  }

  generateBill() {
    // Logic to generate and save the bill will be added here
    console.log('Generating bill for:', this.billedSevas);
    console.log('Total Amount:', this.totalAmount);
    alert(`Bill generated! Total: $${this.totalAmount}`);
  }
}
