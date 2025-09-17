import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentReference
} from '@angular/fire/firestore';
import { Seva } from '../models/seva.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SevaManagementService {
  private firestore: Firestore = inject(Firestore);
  private sevasCollection = collection(this.firestore, 'sevas');

  // This is the corrected method for fetching sevas
  getSevas(): Observable<Seva[]> {
    return collectionData(this.sevasCollection, { idField: 'id' }) as Observable<Seva[]>;
  }

  addSeva(seva: Omit<Seva, 'id'>): Promise<DocumentReference> {
    return addDoc(this.sevasCollection, seva);
  }

  updateSeva(id: string, seva: Partial<Seva>): Promise<void> {
    const sevaDoc = doc(this.firestore, `sevas/${id}`);
    return updateDoc(sevaDoc, seva);
  }

  deleteSeva(id: string): Promise<void> {
    const sevaDoc = doc(this.firestore, `sevas/${id}`);
    return deleteDoc(sevaDoc);
  }
}
