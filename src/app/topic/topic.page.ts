import { Component, OnInit } from '@angular/core';
import { TopicsService } from '../home/topics.service';
import { Observable } from 'rxjs';
import { Topic } from '../home/topic.modet';
import { ActivatedRoute } from '@angular/router';

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
