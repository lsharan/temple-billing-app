import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Seva } from '../models/seva.model';
import { Observable, first } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SevaService {
  private sevasCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private injector: Injector
  ) {
    this.sevasCollection = collection(this.firestore, 'sevas');
  }

  getSevas(): Observable<Seva[]> {
    return runInInjectionContext(this.injector, () =>
      collectionData(this.sevasCollection, { idField: 'id' }) as Observable<Seva[]>
    );
  }

  getSeva(id: string): Observable<Seva> {
    return runInInjectionContext(this.injector, () => {
      const sevaDoc = doc(this.firestore, `sevas/${id}`);
      const sevaData$ = docData(sevaDoc, { idField: 'id' }) as Observable<Seva>;
      // Use the first() operator to take the first emitted value and complete.
      return sevaData$.pipe(first());
    });
  }

  addSeva(seva: Omit<Seva, 'id'>): Promise<DocumentReference> {
    return runInInjectionContext(this.injector, () =>
      addDoc(this.sevasCollection, seva)
    );
  }

  updateSeva(id: string, seva: Partial<Seva>): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const sevaDoc = doc(this.firestore, `sevas/${id}`);
      return updateDoc(sevaDoc, seva);
    });
  }

  deleteSeva(id: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const sevaDoc = doc(this.firestore, `sevas/${id}`);
      return deleteDoc(sevaDoc);
    });
  }
}