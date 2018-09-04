import { Injectable } from '@angular/core';
import { AngularFirestore} from 'angularfire2/firestore';
import { DataService } from '../../shared/data.service';
import { Link } from './link.model';

@Injectable()
export class LinkService extends DataService<Link> {
  constructor(db: AngularFirestore) {
    super(db, 'links')
  }
}