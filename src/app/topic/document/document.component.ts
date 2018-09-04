import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { guid } from '../../helpers/guid-generator.helper';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
  uploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>

  constructor(private storage: AngularFireStorage) { }

  upload(event) {
    const id = guid();
    const file = event.target.files[0];
    const filePath = `topics/${id}`;
    const task = this.storage.upload(filePath, file);
    
    this.uploadProgress$ = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => this.downloadUrl$ = this.storage.ref(filePath).getDownloadURL() )
    )
    .subscribe()
  }
}
