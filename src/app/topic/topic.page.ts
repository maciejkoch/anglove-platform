import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../topics-list/topic.modet';
import { TopicsService } from '../topics-list/topics.service';
import { AlertController } from '@ionic/angular';
import { TopicItem } from '../topics-list/topic-item.model';
import { LinkPreviewService } from './link-preview.service';

@Component({
  selector: 'app-topic',
  templateUrl: 'topic.page.html',
  styleUrls: ['topic.page.scss']
})
export class TopicPage {

  item: Topic;

  constructor(private route: ActivatedRoute, private alertController: AlertController, private topicsService: TopicsService, private linkPreviewService: LinkPreviewService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.topicsService.getItem(params.id).subscribe(item => this.item = item);
      }
    });
  }

  async presentNewUrlAlert() {
    const alert = await this.alertController.create({
      header: 'New url',
      inputs: [{
        name: 'url',
        type: 'text',
        placeholder: 'Url'
      }],
      buttons: [{
        text: 'Ok',
        handler: data => this.createTopicItem(data)
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })

    await alert.present();
  }

  private createTopicItem(topicItem: TopicItem) {
    this.linkPreviewService.getLinkPreview(topicItem.url).subscribe((preview: TopicItem) => {
      const topicItems = this.item.items ? [...this.item.items, preview ] : [preview]
      const updatedItem = {...this.item, items: topicItems};
      this.topicsService.updateItem(updatedItem);
    })

  }
}
