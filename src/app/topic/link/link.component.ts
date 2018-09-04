import { Component } from '@angular/core';
import { AngularFireStorage} from 'angularfire2/storage';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LinkService } from './link.service';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { LinkPreviewService } from '../../shared/link-preview.service';
import { Link } from './link.model';

@Component({
  selector: 'link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  form: FormGroup;
  isPreviewInProgress: boolean = false;

  submitAttempt: boolean = false;
  topicId: string;
  itemId: string;
  imageSrc: string;

  constructor(params: NavParams, fb: FormBuilder, private modalCtrl: ModalController, private alertController: AlertController, private linkeService: LinkService, private linkPreviewService: LinkPreviewService) {
    this.topicId = params.get('topicId');

    this.form = fb.group({
      url: ['', Validators.required],
      title: ['', Validators.required],
      description: ['']
    });

    const item: Link = params.get('item');
    if (item) {
      this.itemId = item.id;
      this.imageSrc = item.image;
      this.form.patchValue(item, { emitEvent: false });
    }

    this.form.get('url').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    )
    .subscribe(newUrl => {
      this.isPreviewInProgress = true;
      this.linkPreviewService.getLinkPreview(newUrl)
      .subscribe(
        (preview: Link) => {
          this.form.patchValue(preview, { emitEvent: false });
          this.imageSrc = preview.image;
          this.fetchingPreviewCompleted()
        },
        () => this.fetchingPreviewCompleted()
      )
    });
  }


  async delete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [{
        text: 'Ok',
        handler: () => this.linkeService.deleteItem(this.itemId).subscribe(() => this.close())
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })

    await alert.present();
  }

  save() {
    this.submitAttempt = true;
    if (this.form.valid) {
      const item = {
        ...this.form.getRawValue(),
        topicId: this.topicId
      };

      if (this.imageSrc) {
        item.image = this.imageSrc;
      }
  
      if (this.itemId) {
        item.id = this.itemId;
      }
      
  
      const save$ = item.id ? this.linkeService.updateItem(item) : this.linkeService.addItem(item);
      save$.subscribe(() => this.close());
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  private fetchingPreviewCompleted() {
    this.isPreviewInProgress = false;
  }
}
