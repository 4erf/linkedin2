export interface ResultItem extends ResultItemApi {
  seen: boolean;
  applied: boolean;
}

export interface ResultItemApi {
  id: string;
  location: string;
  listed_at: number;
  title: string;
  remote_allowed: boolean;
  company_name: string;
  company_logo: string;
  company_staff_count: number;
}
