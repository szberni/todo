import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments';
import { List, ListResponse, ListUpdate } from '../models';

@Injectable({ providedIn: 'root' })
export class ListsRequestsService {
  private BASE_URL: string = environment.BASE_URL;
  private LISTS_URL = `${this.BASE_URL}/lists`;

  constructor(private http: HttpClient) {}

  createList(list: List): Observable<ListResponse> {
    return this.http.post<ListResponse>(this.LISTS_URL, list);
  }

  getLists(boardId: number): Observable<ListResponse[]> {
    return this.http
      .get<ListResponse[]>(this.LISTS_URL, {
        params: new HttpParams({ fromObject: { boardId } }),
      });
  }

  updateList(listUpdate: ListUpdate): Observable<ListResponse> {
    return this.http.patch<ListResponse>(`${this.LISTS_URL}/${listUpdate.id}`, listUpdate);
  }
}
