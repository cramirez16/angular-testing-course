import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagInterface } from '../types/tag.interface';

// @Injectable({
//   providedIn: 'root',
// })
@Injectable()
export class ApiService {
  httpClient = inject(HttpClient);
  apiUrl = 'http://localhost:3004';
  constructor() {}
  getTags(): Observable<TagInterface[]> {
    return this.httpClient.get<TagInterface[]>(`${this.apiUrl}/tags`);
  }
  createTag(name: string): Observable<TagInterface> {
    return this.httpClient.post<TagInterface>(`${this.apiUrl}/tags`, { name });
  }
}
