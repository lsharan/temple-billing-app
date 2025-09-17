import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Account {
  id?: string;
  name: string;
  type: string;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsCollection;

  constructor(private firestore: Firestore) {
    this.accountsCollection = collection(this.firestore, 'accounts');
  }

  getAccounts(): Observable<Account[]> {
    return collectionData(this.accountsCollection, { idField: 'id' }) as Observable<Account[]>;
  }

  getAccount(id: string): Observable<Account | null> {
    const accountDocRef = doc(this.firestore, 'accounts', id);
    return from(getDoc(accountDocRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Account;
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Error fetching account:', error);
        return throwError(() => error);
      })
    );
  }

  updateAccount(id: string, data: Partial<Account>): Promise<void> {
    const accountDocRef = doc(this.firestore, 'accounts', id);
    return updateDoc(accountDocRef, data);
  }
}