import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Topic } from './topic.model';
import { DataService } from '../shared/data.service';

@Injectable()
export class TopicsService extends DataService<Topic> {
  constructor(db: AngularFirestore) {
    super(db, 'topics');
  }
}