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
import { Observable, first } from 'rxjs';

export interface Devotee {
  id?: string;
  name: string;
  phone: string;
  gotra: string;
  nakshatra: string;
}

@Injectable({ providedIn: 'root' })
export class DevoteeService {
  private devoteesCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private injector: Injector
  ) {
    this.devoteesCollection = collection(this.firestore, 'devotees');
  }

  getDevotees(): Observable<Devotee[]> {
    return runInInjectionContext(this.injector, () =>
      collectionData(this.devoteesCollection, { idField: 'id' }) as Observable<Devotee[]>
    );
  }

  getDevotee(id: string): Observable<Devotee> {
    return runInInjectionContext(this.injector, () => {
      const devoteeDoc = doc(this.firestore, `devotees/${id}`);
      const devoteeData$ = docData(devoteeDoc, { idField: 'id' }) as Observable<Devotee>;
      return devoteeData$.pipe(first());
    });
  }

  addDevotee(devotee: Omit<Devotee, 'id'>): Promise<DocumentReference> {
    return runInInjectionContext(this.injector, () =>
      addDoc(this.devoteesCollection, devotee)
    );
  }

  updateDevotee(id: string, devotee: Partial<Devotee>): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const devoteeDoc = doc(this.firestore, `devotees/${id}`);
      return updateDoc(devoteeDoc, devotee);
    });
  }

  deleteDevotee(id: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const devoteeDoc = doc(this.firestore, `devotees/${id}`);
      return deleteDoc(devoteeDoc);
    });
  }
}