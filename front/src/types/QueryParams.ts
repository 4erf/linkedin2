export interface QueryParamsFull extends QueryParams {
  showSeen: boolean;
}

export interface QueryParams {
  search: string;
  staffValue: number;
  staffWeight: number;
  daysValue: number;
  daysWeight: number;
}
