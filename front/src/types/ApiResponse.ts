export interface ApiSingleResponse<T> {
  _id: string;
  _source: T;
}

export interface ApiManyResponse<T> {
  hits: {
    hits: ApiSingleResponse<T>[];
  }
}
