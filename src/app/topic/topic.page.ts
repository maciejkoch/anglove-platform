import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../topics-list/topic.modet';
import { TopicsService } from '../topics-list/topics.service';

@Component({
  selector: 'app-topic',
  templateUrl: 'topic.page.html',
  styleUrls: ['topic.page.scss']
})
export class TopicPage {

  item$: Observable<Topic>;

  constructor(private route: ActivatedRoute, private topicsService: TopicsService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.id) {
        this.item$ = this.topicsService.getItem(params.id);
      }
    });
  }
}
