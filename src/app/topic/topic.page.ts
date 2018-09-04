import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../topics-list/topic.model';
import { TopicsService } from '../topics-list/topics.service';
import { AlertController, PopoverController, NavController, ModalController } from '@ionic/angular';
import { TopicItem } from '../topics-list/topic-item.model';
import { LinkPreviewService } from './link-preview.service';
import { guid } from '../helpers/guid-generator.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentComponent } from './document/document.component';
import { DocumentService } from './document/document.service';
import { Document } from './document/document.model';

@Component({
  selector: 'app-topic',
  templateUrl: 'topic.page.html',
  styleUrls: ['topic.page.scss'],
})
export class TopicPage {

  form: FormGroup;
  item: Topic;
  edit: boolean = true;

  documents$: Observable<Document[]>

  constructor(fb: FormBuilder, private route: ActivatedRoute, private navCtrl: NavController, private alertController: AlertController, private modalController: ModalController, private topicsService: TopicsService, private documentSevice: DocumentService, private linkPreviewService: LinkPreviewService) {
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
        // this.documents$ = this.documentSevice.getItems();
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

  async presentNewUrlAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'New url',
      inputs: [{
        name: 'url',
        type: 'text',
        placeholder: 'Url'
      }],
      buttons: [{
        text: 'Ok',
        handler: data => this.addTopicItem(this.item, data)
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })

    await alert.present();
  }

  async openDocumentModal(item: Document) {
    const modal = await this.modalController.create({
      component: DocumentComponent,
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

  async deleteItem(topicItem: TopicItem): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [{
        text: 'Ok',
        handler: () => this.deleteItemAndSave(this.item, topicItem)
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })

    await alert.present();
  }

  private addTopicItem(item: Topic, topicItem: TopicItem) {
    this.linkPreviewService.getLinkPreview(topicItem.url)
    .subscribe(
      (preview: TopicItem) => this.addItemAndSave(item, preview),
      () => this.addItemAndSave(item, topicItem)
    )
  }

  private deleteAndSave(): Observable<boolean> {
    return this.topicsService.deleteItem(this.item.id).pipe(
      flatMap(() => this.navCtrl.goBack('/topics'))
    );
  }

  private addItemAndSave(item: Topic, topicItem: TopicItem): Observable<Topic> {
    const newItem = {...topicItem, id: guid() };
    const topicItems = this.item.items ? [...this.item.items, newItem ] : [newItem]
    const updatedItem = {...item, items: topicItems};
    return this.topicsService.updateItem(updatedItem);
  }

  private deleteItemAndSave(item: Topic, topicItem: TopicItem): Observable<Topic> {
    const topicItems = this.item.items.filter(item => item.id !== topicItem.id)
    const updatedItem = {...item, items: topicItems};
    return this.topicsService.updateItem(updatedItem);
  }

}
