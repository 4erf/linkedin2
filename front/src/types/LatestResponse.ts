export interface LatestResponse {
  aggregations: {
    [agg_name: string]: {
      value_as_string: string;
    };
  };
}
