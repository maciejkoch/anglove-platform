import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TopicPage } from './topic.page';
import { TopicsService } from '../topics-list/topics.service';
import { LinkPreviewService } from './link-preview.service';
import { DocumentComponent } from './document/document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TopicPage
      }
    ])
  ],
  declarations: [TopicPage, DocumentComponent ],
  providers: [
    TopicsService,
    LinkPreviewService
  ],
  entryComponents: [
    DocumentComponent
  ]
})
export class TopicPageModule {}
