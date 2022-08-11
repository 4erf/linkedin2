import { ResultItem, ResultItemApi } from '../types/ResultItem';
import { QueryParams, QueryParamsFull } from '../types/QueryParams';
import { ApiManyResponse, ApiSingleResponse } from '../types/ApiResponse';
import { JobQuery } from '../consts/JobQuery';
import { JobItem } from '../types/JobItem';
import { StateItem } from '../types/StateItem';
import { Token } from '../types/Token';
import { AnalyzerResponse } from '../types/AnalyzerResponse';

export class Api {
  private static readonly base = `http://localhost:9200`;
  private static readonly headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
  private static states: { [id: string]: StateItem };

  public static async fetchFilteredResults(query: QueryParamsFull): Promise<ResultItem[]> {
    const { showSeen, showApplied, ...apiQuery } = query;
    const apiResults = await this.fetchResults(apiQuery);
    this.states = await this.fetchStates();

    const results = apiResults.map(result => ({
      ...result,
      seen: !!this.states[result.id]?.seen,
      applied: !!this.states[result.id]?.applied,
    }))

    return results.filter(result => {
      if (showSeen && showApplied) { return result.seen && result.applied }
      if (showSeen) { return result.seen }
      if (showApplied) { return result.applied }
      return !result.seen && !result.applied
    })
  }

  public static async fetchStates(): Promise<{ [id: string]: StateItem }> {
    const res = await fetch(`${this.base}/state/_search?size=10000`, { method: 'GET', headers: this.headers })
    const data: ApiManyResponse<StateItem> = await res.json();
    return Object.fromEntries(data.hits.hits.map(hit => [hit._id, hit._source]));
  }

  public static async fetchState(id: string): Promise<StateItem | null> {
    const res = await fetch(`${this.base}/state/_doc/${id}`, { method: 'GET', headers: this.headers })
    const data: ApiSingleResponse<StateItem> = await res.json();
    return data._source || null;
  }

  public static async fetchResults(query: QueryParams): Promise<ResultItemApi[]> {
    const fields: Array<keyof ResultItemApi> = [
      'id', 'location', 'listed_at', 'title', 'company_name',
      'company_logo', 'company_staff_count', 'remote_allowed'
    ]
    const res = await fetch(`${this.base}/jobs/_search`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(JobQuery(query, fields))
    })
    const data: ApiManyResponse<ResultItemApi> = await res.json();
    return data.hits.hits.map(hit => hit._source);
  }

  public static async fetchJob(id: string): Promise<JobItem> {
    const res = await fetch(`${this.base}/jobs/_doc/${id}`, { method: 'GET', headers: this.headers })
    const data: ApiSingleResponse<JobItem> = await res.json();
    const state = await this.fetchState(id);
    return {
      ...data._source,
      seen: !!state?.seen,
      applied: !!state?.applied,
    };
  }

  public static async createState(id: string): Promise<void> {
    this.states[id] = { seen: false, applied: false };
    await fetch(`${this.base}/state/_create/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(this.states[id])
    })
  }

  public static async markJobAsSeen(id: string, seen: boolean): Promise<void> {
    if (!this.states[id]) { await this.createState(id) }
    await fetch(`${this.base}/state/_update/${id}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ doc: { seen } })
    })
  }

  public static async markJobAsApplied(id: string, applied: boolean): Promise<void> {
    if (!this.states[id]) { await this.createState(id) }
    await fetch(`${this.base}/state/_update/${id}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ doc: { applied } })
    })
  }

  public static async fetchTokens(text: string): Promise<Token[]> {
    const res = await fetch(`${this.base}/_analyze`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ analyzer: 'standard', text })
    })
    const data: AnalyzerResponse = await res.json();
    return data.tokens;
  }
}
