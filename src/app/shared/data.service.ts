import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Data } from './data.model';

@Injectable()
export abstract class DataService<T extends Data> {
  constructor(private db: AngularFirestore, private collection: string) {}

  addItem(item: T): Observable<T> {
    item = this.touch(item);
    const promise: Promise<T> = this.db.collection(this.collection).add(item).then((document: DocumentReference) => {
      return Object.assign<T, any>(item, { id: document.id });
    });

    return from(promise);
  }

  updateItem(item: T ): Observable<T>  {
    item = this.touch(item);
    const promise = this.getFirestoreDocument(item.id).update(item).then(() => item);
    return from(promise);
  }

  deleteItem(id: string): Observable<boolean>  {
    return from(this.getFirestoreDocument(id).delete().then(() => true));
  }

  getItems(): Observable<T[]> {
    return this.db.collection(this.collection).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const item: T = action.payload.doc.data() as T;
          return Object.assign<T, any>(item, { id: action.payload.doc.id })
        });
      })
    )
  }

  getItemsByQuery(property: string, value: string): Observable<T[]> {
    return this.db.collection(this.collection, ref => ref.where(property, '==', value)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const item: T = action.payload.doc.data() as T;
          return Object.assign<T, any>(item, { id: action.payload.doc.id })
        });
      })
    )
  }

  getItem(id: string): Observable<T> {
    return this.getFirestoreDocument(id).snapshotChanges().pipe(
      map(action => {
        const item: T = action.payload.data() as T;
        return Object.assign<T, any>(item, {id: action.payload.id});
      })
    )
  }

  private getFirestoreDocument(id: string): AngularFirestoreDocument {
    return this.db.doc<T>(`${this.collection}/${id}`);
  }

  private touch(item: T): T {
    return Object.assign<T, any>(item, { lastUpdate: Date.now() });
  }
}