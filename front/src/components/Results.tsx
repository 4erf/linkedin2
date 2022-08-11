import './Results.scss'
import JobList from './JobList';
import JobDetail from './JobDetail';
import { ResultItem } from '../types/ResultItem';
import { JobItem } from '../types/JobItem';
import { useState } from 'react';
import { Api } from '../services/Api';
import { Token } from '../types/Token';

interface Props {
  results: ResultItem[];
  tokens: Token[];
}

function Results(props: Props) {
  const [job, setJob] = useState<JobItem | null>(null);

  async function fetchJob(item: ResultItem): Promise<void> {
    setJob(await Api.fetchJob(item.id))
  }

  return (
    <div className='Results'>
      <JobList results={props.results} selectedJob={job} onItemSelected={fetchJob} />
      <JobDetail job={job} tokens={props.tokens} />
    </div>
  )
}

export default Results;
