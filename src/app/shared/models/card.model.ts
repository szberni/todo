export interface Card {
  id?: number;
  title: string;
  boardId: number;
  listId: number;
  archived: boolean;
  description?: string;
}

export type CardResponse = Card & Required<Pick<Card, 'id'>>;

export type CardUpdate = Partial<CardResponse> & Pick<CardResponse, 'id'>;
