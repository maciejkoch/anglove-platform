import { TopicItem } from "./topic-item.model";

export interface Topic {
  id: string
  title: string,
  description: string,
  lastUpdate: number,
  items: TopicItem[]
}