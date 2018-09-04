import { Data } from "../../shared/data.model";

export interface Document extends Data {
  topicId: string,
  title: string,
  description?: string,
  file?: DocumentFile
}

export interface DocumentFile {
  id: string,
  name: string,
  downloadUrl: string;
  type: string;
  size: number;
}