import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../topics-list/topic.model';
import { TopicsService } from '../topics-list/topics.service';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentComponent } from './document/document.component';
import { DocumentService } from './document/document.service';
import { Document } from './document/document.model';
import { Link } from './link/link.model';
import { LinkComponent } from './link/link.component';
import { LinkService } from './link/link.service';

@Component({
  selector: 'app-topic',
  templateUrl: 'topic.page.html',
  styleUrls: ['topic.page.scss'],
})
export class TopicPage {

  form: FormGroup;
  item: Topic;
  edit: boolean = true;

  links$: Observable<Link[]>
  documents$: Observable<Document[]>

  constructor(fb: FormBuilder, private route: ActivatedRoute, private navCtrl: NavController, private alertController: AlertController, private modalController: ModalController, private topicsService: TopicsService, private documentSevice: DocumentService, private linkService: LinkService) {
    this.form = fb.group({
      title: ['', Validators.required],
      description: ['']
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.topicsService.getItem(params.id).subscribe(item => {
          this.item = item;
          this.form.patchValue(item, { emitEvent: false });
        });

        this.documents$ = this.documentSevice.getItemsByQuery('topicId', params.id);
        this.links$ = this.linkService.getItemsByQuery('topicId', params.id);
      }
    });

    this.form.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(250)
    )
    .subscribe(changes => {
      const updatedItem = Object.assign<Topic, any>(this.item, changes);
      this.topicsService.updateItem(updatedItem);
    });
  }

  async openDocumentModal(item: Document) {
    const modal = await this.modalController.create({
      component: DocumentComponent,
      componentProps: { topicId: this.item.id, item }
    });
    return await modal.present();
  }

  async openLinkModal(item: Link) {
    const modal = await this.modalController.create({
      component: LinkComponent,
      componentProps: { topicId: this.item.id, item }
    });
    return await modal.present();
  }

  async delete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [{
        text: 'Ok',
        handler: () => this.deleteAndSave().subscribe()
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })

    await alert.present();
  }

  private deleteAndSave(): Observable<boolean> {
    return this.topicsService.deleteItem(this.item.id).pipe(
      flatMap(() => this.navCtrl.goBack('/topics'))
    );
  }
}
