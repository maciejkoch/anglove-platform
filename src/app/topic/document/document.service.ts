import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../../shared/data.service';
import { Document } from './document.model';

@Injectable()
export class DocumentService extends DataService<Document> {
  constructor(db: AngularFirestore) {
    super(db, 'documents')
  }
}