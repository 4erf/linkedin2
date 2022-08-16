export interface QueryParamsFull extends QueryParams {
  showSeen: boolean;
  showApplied: boolean;
  showLatest: boolean;
}

export interface QueryParams {
  search: string;
  staffValue: number;
  staffWeight: number;
  daysValue: number;
  daysWeight: number;
}
