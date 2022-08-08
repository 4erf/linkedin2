import { ResultItem } from './ResultItem';

export interface JobItem extends ResultItem {
  description: string;
  apply_link: string;
  company_description: string;
  company_category: string;
  company_hq_country: string;
  company_hq_city: string;
}
