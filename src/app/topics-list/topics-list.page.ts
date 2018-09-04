import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TopicsService } from './topics.service';
import { Topic } from './topic.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-topics-list',
  templateUrl: 'topics-list.page.html',
  styleUrls: ['topics-list.page.scss'],
})
export class TopicsListPage {

  items: Observable<Topic[]>;

  constructor(private alertController: AlertController, private topicsService: TopicsService, private navCtrl: NavController) {}

  ngOnInit() {
    this.items = this.topicsService.getItems();
  }

  async presentNewTopicAlert() {
    const alert = await this.alertController.create({
      header: 'New Topic',
      inputs: [{
        name: 'title',
        type: 'text',
        placeholder: 'Title'
      }],
      buttons: [{
        text: 'Ok',
        handler: data => this.createTopic(data)
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })

    await alert.present();
  }

  navigate(item: Topic) {
    this.navCtrl.goForward(`/topic/${item.id}`);
  }

  private createTopic(data: Topic) {
   this.topicsService.addItem(data).subscribe(item => this.navigate(item));
  }
}
