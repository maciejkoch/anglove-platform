import { Component } from '@angular/core';
import { AngularFireStorage} from 'angularfire2/storage';
import { guid } from '../../helpers/guid-generator.helper';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { DocumentService } from './document.service';
import { Document, DocumentFile } from './document.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { has } from 'lodash';

@Component({
  selector: 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
  form: FormGroup;

  isUploadInProgress: boolean = false;
  
  uploadedFile: DocumentFile;
  topicId: string;
  itemId: string;

  constructor(params: NavParams, fb: FormBuilder, private modalCtrl: ModalController, private alertController: AlertController, private storage: AngularFireStorage, private documentService: DocumentService) {
    this.topicId = params.get('topicId');

    this.form = fb.group({
      title: ['', Validators.required],
      description: ['']
    });

    const item = params.get('item');
    if (item) {
      this.itemId = item.id;
      this.form.patchValue(item, { emitEvent: false });
      this.uploadedFile = item.file;
    }
  }

  upload(event) {
    this.isUploadInProgress = true;

    const id = guid();
    const file = event.target.files[0];
    const filePath = `topics/${id}`;

    this.storage.upload(filePath, file).snapshotChanges().pipe(
      finalize(() => {
        this.storage.ref(filePath).getDownloadURL().subscribe(downloadUrl => {
          this.isUploadInProgress = false;
          this.uploadedFile = {
            id,
            name: file.name,
            downloadUrl
          }
        });
      })
    )
    .subscribe()
  }

  async delete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [{
        text: 'Ok',
        handler: () => this.documentService.deleteItem(this.itemId).subscribe(() => this.close())
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })

    await alert.present();
  }

  save() {
    const item = {
      ...this.form.getRawValue(),
      topicId: this.topicId,
      file: this.uploadedFile  
    };

    if (this.itemId) {
      item.id = this.itemId;
    }

    const save$ = item.id ? this.documentService.updateItem(item) : this.documentService.addItem(item);
    save$.subscribe(() => this.close());
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
