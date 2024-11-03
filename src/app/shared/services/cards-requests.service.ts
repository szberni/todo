import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments';
import { Card, CardResponse, CardUpdate } from '../models';

@Injectable({ providedIn: 'root' })
export class CardsRequestsService {
  private BASE_URL: string = environment.BASE_URL;
  private CARDS_URL = `${this.BASE_URL}/cards`;

  constructor(private http: HttpClient) {}

  createCard(card: Card): Observable<CardResponse> {
    return this.http.post<CardResponse>(this.CARDS_URL, card);
  }

  getCards(boardId: number): Observable<CardResponse[]> {
    return this.http.get<CardResponse[]>(this.CARDS_URL, {
      params: new HttpParams({ fromObject: { boardId } }),
    });
  }

  getCard(id: number): Observable<CardResponse> {
    return this.http.get<CardResponse>(`${this.CARDS_URL}/${id}`);
  }

  updateCard(cardUpdate: CardUpdate): Observable<CardResponse> {
    return this.http.patch<CardResponse>(`${this.CARDS_URL}/${cardUpdate.id}`, cardUpdate);
  }
}
