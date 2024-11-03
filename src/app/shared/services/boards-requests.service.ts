import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments';
import { Board, BoardResponse, BoardUpdate } from '../models';

@Injectable({ providedIn: 'root' })
export class BoardsRequestsService {
  private BASE_URL: string = environment.BASE_URL;
  private BOARDS_URL = `${this.BASE_URL}/boards`;

  constructor(private http: HttpClient) {}

  createBoard(board: Board): Observable<BoardResponse> {
    return this.http.post<BoardResponse>(this.BOARDS_URL, board);
  }

  getAllBoards(): Observable<BoardResponse[]> {
    return this.http.get<BoardResponse[]>(this.BOARDS_URL);
  }

  getBoard(id: number): Observable<BoardResponse> {
    return this.http.get<BoardResponse>(`${this.BOARDS_URL}/${id}`);
  }

  replaceBoard(updatedBoard: BoardResponse): Observable<BoardResponse> {
    return this.http.put<BoardResponse>(`${this.BOARDS_URL}/${updatedBoard.id}`, updatedBoard);
  }

  updateBoard(boardUpdate: BoardUpdate): Observable<BoardResponse> {
    return this.http.patch<BoardResponse>(`${this.BOARDS_URL}/${boardUpdate.id}`, boardUpdate);
  }
}
