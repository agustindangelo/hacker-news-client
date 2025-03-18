import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Story } from '../models/Story';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiBaseUrl = environment.apiBaseUrl;
  private storiesIdsUrl = `${this.apiBaseUrl}/topstories`;
  private itemsUrl = `${this.apiBaseUrl}/items`;

  constructor(private http: HttpClient) {}

  getLatestStoriesIds(): Observable<number[]> {
    return this.http.get<number[]>(this.storiesIdsUrl);
  }

  getStories(page: number = 1, pageSize: number = 10): Observable<Story[]> {
    return this.http.get<number[]>(this.storiesIdsUrl).pipe(
      map((ids) => ids.slice((page - 1) * pageSize, page * pageSize)),
      switchMap((ids) => {
        const storyRequests = ids.map((id) => this.getStory(id));
        return forkJoin(storyRequests);
      })
    );
  }

  getStory(id: number): Observable<Story> {
    const url = `${this.itemsUrl}/${id}`;
    return this.http.get<any>(url);
  }

  searchStories(title: string): Observable<Story[]> {
    const url = `${this.itemsUrl}/search`;
    return this.http.get<any>(url, { params: { title: title.trim() } });
  }

  getComments(ids: number[]): Observable<any[]> {
    const commentRequests = ids.map((id) => this.getStory(id));
    return forkJoin(commentRequests);
  }
}
