import { Data } from "../shared/data.model";

export interface Topic extends Data {
  title: string,
  description?: string,
}