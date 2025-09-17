import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch, runTransaction, increment, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Transaction {
  // ... your transaction interface properties
  id?: string;
  transactionDate: Date;
  sevaId: string;
  devoteeId: string;
  sevaName: string; // Add Seva Name
  devoteeName: string; // Add Devotee Name
  amount: number;
  paymentMethod: string;
  sevaDate: string;
  gotra: string;
  nakshatra: string;
  debitAccount: string;
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private transactionsCollection;
    private accountsCollection;

    constructor(
      private firestore: Firestore,
      private injector: Injector
    ) {
        this.transactionsCollection = collection(this.firestore, 'transactions');
        this.accountsCollection = collection(this.firestore, 'accounts'); // For ledger updates
    }

    getTransactions(): Observable<Transaction[]> {
        return runInInjectionContext(this.injector, () => {
            const q = query(this.transactionsCollection, orderBy('transactionDate', 'desc'));
            return collectionData(q, { idField: 'id' }) as Observable<Transaction[]>;
        });
    }

    getTransaction(id: string): Observable<any> {
        const docRef = doc(this.transactionsCollection, id);
        return from(getDoc(docRef)).pipe(
            map(snapshot => snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null)
        );
    }

    async addTransaction(transaction: any): Promise<void> {
        try {
            // 1. Add the new transaction document
            const newTransactionRef = await addDoc(this.transactionsCollection, transaction);

            // 2. Update account balances using Firestore transaction
            await runTransaction(this.firestore, async (trans) => {
                const debitAccountRef = doc(this.firestore, 'accounts', transaction.debitAccount);
                const templeAccountRef = doc(this.firestore, 'accounts', 'Temple_Fund_Account');
                const priestAccountRef = doc(this.firestore, 'accounts', 'Priest_Account');

                const debitAccountDoc = await trans.get(debitAccountRef);
                const templeAccountDoc = await trans.get(templeAccountRef);
                const priestAccountDoc = await trans.get(priestAccountRef);

                if (!debitAccountDoc.exists()) {
                    throw new Error('Debit account does not exist!');
                }

                if (!templeAccountDoc.exists()) {
                    throw new Error('Temple account does not exist!');
                }

                if (!priestAccountDoc.exists()) {
                    throw new Error('Priest account does not exist!');
                }

                const debitBalance = debitAccountDoc.data()?.['balance'] || 0;
                const templeBalance = templeAccountDoc.data()?.['balance'] || 0;
                const priestBalance = priestAccountDoc.data()?.['balance'] || 0;

                // Fetch seva details to get the split
                const sevaDocRef = doc(this.firestore, 'sevas', transaction.sevaId);
                const sevaDoc = await trans.get(sevaDocRef);

                if (!sevaDoc.exists()) {
                    throw new Error('Seva does not exist!');
                }

                const sevaData = sevaDoc.data();
                const templeShare = sevaData?.['templeShare'] || 0;
                const priestShare = sevaData?.['priestShare'] || 0;

                trans.update(debitAccountRef, { balance: debitBalance - transaction.amount });
                trans.update(templeAccountRef, { balance: templeBalance + templeShare });
                trans.update(priestAccountRef, { balance: priestBalance + priestShare });
            });

            console.log('Transaction added successfully!');
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error; // Re-throw the error to be handled by the component
        }
    }

    updateTransaction(id: string, data: any): Promise<void> {
        const docRef = doc(this.transactionsCollection, id);
        return updateDoc(docRef, data);
    }

    deleteTransaction(id: string): Promise<void> {
        const docRef = doc(this.transactionsCollection, id);
        return deleteDoc(docRef);
    }

    // Example of fetching devotee's past transactions
    getDevoteeTransactions(devoteeId: string): Observable<any[]> {
        const q = query(this.transactionsCollection, where('devoteeId', '==', devoteeId));
        return collectionData(q, { idField: 'id' });
    }
}