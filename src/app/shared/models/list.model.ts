export interface List {
  id?: number;
  title: string;
  boardId: number;
  archived: boolean;
  cardIds: number[];
}

export type ListResponse = List & Required<Pick<List, 'id'>>;

export type ListUpdate = Partial<ListResponse> & Pick<ListResponse, 'id'>;
