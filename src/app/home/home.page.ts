import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TopicsService } from './topics.service';
import { Topic } from './topic.modet';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  items: Observable<Topic[]>;

  constructor(private alertController: AlertController, private topicsService: TopicsService) {}

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

  private createTopic(data: Topic) {
   this.topicsService.addItem(data).subscribe(item => console.log(item))
  }
}
