import { TopicItem } from "./topic-item.model";

export interface Topic {
  id: string
  title: string,
  items: TopicItem[]
}