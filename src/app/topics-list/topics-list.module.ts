import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TopicsListPage } from './topics-list.page';
import { TopicsService } from './topics.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TopicsListPage
      }
    ])
  ],
  declarations: [TopicsListPage],
  providers: [
    TopicsService
  ]
})
export class TopicsListPageModule {}
