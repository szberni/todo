export interface Board {
  id?: number;
  title: string;
  listIds: number[];
  ownerId: number;
  isFavorite: boolean;
}

export type BoardResponse = Board & Required<Pick<Board, 'id'>>;

export type BoardUpdate = Partial<BoardResponse> & Pick<BoardResponse, 'id'>;
