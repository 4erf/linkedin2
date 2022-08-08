import './JobList.scss'
import { Card, CardContent, Divider, List, Pagination, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import JobListItem from './JobListItem';
import { ResultItem } from '../types/ResultItem';
import { JobItem } from '../types/JobItem';

interface Props {
  results: ResultItem[];
  selectedJob: JobItem | null;
  onItemSelected: (item: ResultItem) => void;
}

function JobList(props: Props) {
  const [page, setPage] = useState(1);

  const len = props.results.length;
  const itemsPerPage = 25;
  const [start, end] = [(page - 1) * itemsPerPage, page * itemsPerPage];

  useEffect(() => {
    document.getElementsByClassName('scroll')[0].scrollTo({ top: 0 });
  }, [page])

  return (
    <div className='JobList'>
      <Card elevation={0} sx={{ backgroundColor: 'primary.main', borderRadius: 0 }}>
        <CardContent>
          <Typography variant="body2" color='primary.contrastText'>
            {props.results.length} results
          </Typography>
        </CardContent>
      </Card>
      <div className="scroll">
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {props.results.slice(start, end).map((item, i) => (
            <React.Fragment key={item.id}>
              <JobListItem
                item={item}
                selected={item.id === props.selectedJob?.id}
                onItemSelect={() => props.onItemSelected(item)}
              />
              {len - 1 === i || <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Stack alignItems='center' pt={2} pb={3}>
          <Pagination
            count={Math.ceil(len / itemsPerPage)}
            defaultPage={page}
            page={page}
            boundaryCount={2}
            onChange={(e, page) => setPage(page)}
          />
        </Stack>
      </div>
    </div>
  )
}

export default JobList;
