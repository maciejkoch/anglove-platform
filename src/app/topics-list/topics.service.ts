import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Topic } from './topic.modet';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TopicsService {
  items: AngularFirestoreCollection<Topic>;

  constructor(private db: AngularFirestore) {
    this.items = db.collection<Topic>('topics');
  }

  addItem(item: Topic): Observable<Topic> {
    const promise: Promise<Topic> = this.items.add(item).then((document: DocumentReference) => {
      return {...item, id: document.id}
    });

    return from(promise);
  }

  updateItem(item: Topic ): Observable<any>  {
    return from(this.getFirestoreDocument(item.id).update(item));
  }

  deleteItem(item: Topic ): Observable<any>  {
    return from(this.getFirestoreDocument(item.id).delete());
  }

  getItems(): Observable<Topic[]> {
    return this.items.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          let data = a.payload.doc.data() as Topic;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    )
  }

  getItem(id: string): Observable<Topic> {
    return this.db.doc<Topic>(`topics/${id}`).snapshotChanges().pipe(
      map(action => {
        let data = action.payload.data() as Topic;
        data.id = action.payload.id;
        return data;
      })
    )
  }

  private getFirestoreDocument(id: string): AngularFirestoreDocument {
    return this.db.doc<Topic>(`topics/${id}`);
  }
}