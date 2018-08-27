import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TopicPage } from './topic.page';
import { TopicsService } from '../topics-list/topics.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TopicPage
      }
    ])
  ],
  declarations: [TopicPage],
  providers: [
    TopicsService
  ]
})
export class TopicPageModule {}
