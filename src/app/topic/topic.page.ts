import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../topics-list/topic.modet';
import { TopicsService } from '../topics-list/topics.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { TopicItem } from '../topics-list/topic-item.model';
import { LinkPreviewService } from './link-preview.service';
import { guid } from '../helpers/guid-generator.helper';

@Component({
  selector: 'app-topic',
  templateUrl: 'topic.page.html',
  styleUrls: ['topic.page.scss']
})
export class TopicPage {

  item: Topic;
  edit: boolean = true;

  constructor(private route: ActivatedRoute, private alertController: AlertController, private popoverController: PopoverController, private topicsService: TopicsService, private linkPreviewService: LinkPreviewService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.topicsService.getItem(params.id).subscribe(item => this.item = item);
      }
    });
  }

  toggleEdit(): void {
    this.edit = !this.edit;
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

  async delete(topicItem: TopicItem): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [{
        text: 'Ok',
        handler: () => this.removeItemAndSave(this.item, topicItem)
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

  private addItemAndSave(item: Topic, topicItem: TopicItem): Observable<Topic> {
    const newItem = {...topicItem, id: guid() };
    const topicItems = this.item.items ? [...this.item.items, newItem ] : [newItem]
    const updatedItem = {...item, items: topicItems};
    return this.topicsService.updateItem(updatedItem);
  }

  private removeItemAndSave(item: Topic, topicItem: TopicItem): Observable<Topic> {
    const topicItems = this.item.items.filter(item => item.id !== topicItem.id)
    const updatedItem = {...item, items: topicItems};
    return this.topicsService.updateItem(updatedItem);
  }

}
