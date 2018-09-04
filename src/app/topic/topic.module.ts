import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TopicPage } from './topic.page';
import { TopicsService } from '../topics-list/topics.service';
import { LinkPreviewService } from '../shared/link-preview.service';
import { DocumentComponent } from './document/document.component';
import { DocumentService } from './document/document.service';
import { LinkService } from './link/link.service';
import { LinkComponent } from './link/link.component';

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
  declarations: [
    TopicPage,
    DocumentComponent,
    LinkComponent
  ],
  providers: [
    TopicsService,
    LinkPreviewService,
    DocumentService,
    LinkService
  ],
  entryComponents: [
    DocumentComponent,
    LinkComponent
  ]
})
export class TopicPageModule {}
