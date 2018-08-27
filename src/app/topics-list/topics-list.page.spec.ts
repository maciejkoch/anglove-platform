import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsListPage } from './topics-list.page';

describe('TopicsListPage', () => {
  let component: TopicsListPage;
  let fixture: ComponentFixture<TopicsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
