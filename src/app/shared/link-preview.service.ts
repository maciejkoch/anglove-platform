import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LinkPreview } from './link-preview.model';

@Injectable()
export class LinkPreviewService {
  KEY: string = '5b82db174b7a3dd94936c1037b8fc6e682cca3a6e6a4f';

  constructor(private httpClient: HttpClient) {}

  getLinkPreview(url: string): Observable<LinkPreview> {
    let params: HttpParams = new HttpParams();
    params = params.set('key', this.KEY);
    params = params.set('q', url);
    return this.httpClient.get<LinkPreview>('https://api.linkpreview.net', { params })
  }
}