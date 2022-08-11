import './JobDetail.scss'
import { JobItem } from '../types/JobItem';
import { Button, Card, CardContent, Icon, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Api } from '../services/Api';
import { Token } from '../types/Token';

interface Props {
  job: JobItem | null;
  tokens: Token[];
}

function JobDetail(props: Props) {
  const { job, tokens } = props;

  const [applied, setApplied] = useState(!!job?.applied);
  const [description, setDescription] = useState(job?.description);

  function setAppliedState() {
    Api.markJobAsApplied(job!.id, !applied)
    setApplied(!applied)
  }

  useEffect(() => {
    setApplied(!!job?.applied)
    document.getElementsByClassName('JobDetail')[0].scrollTo({ top: 0 })
  }, [job])

  useEffect(() => {
    let desc = job?.description;
    if (!desc) { return; }
    for (let { token } of tokens) {
      let index: number = desc.toLowerCase().indexOf(token.toLowerCase());
      while (index !== -1) {
        desc = desc.slice(0, index + token.length) + '</mark>' + desc.slice(index + token.length);
        desc = desc.slice(0, index) + '<mark>' + desc.slice(index);
        index = desc.toLowerCase().indexOf(token.toLowerCase(), index + '<mark>'.length + 1);
      }
    }
    setDescription(desc);
  }, [job, tokens])

  return (
    <div className="JobDetail">
      <Card elevation={0}>
        <CardContent sx={{ paddingX: 4, paddingY: 3 }}>
          { job ? <Stack spacing={2} alignItems='start'>
            <Typography variant='h5' fontWeight='500'>
              {job.title}
            </Typography>
            <Stack direction='row'>
              <Icon>business</Icon>
              <Typography pl={2} variant='body2'>
                {job.company_hq_city}, {job.company_hq_country}
              </Typography>
            </Stack>
            <Stack direction='row'>
              <Icon>category</Icon>
              <Typography pl={2} variant='body2'>
                {job.company_category}
              </Typography>
            </Stack>
            <Stack direction='row' pb={1}>
              <Icon>link</Icon>
              <Typography
                pl={2}
                variant='body2'
                component='a'
                href={`https://www.google.com/search?q=${job.company_name}`}
                target="_blank"
              >
                {job.company_name}
              </Typography>
              <Typography mx={1}>&#183;</Typography>
              <Typography
                variant='body2'
                component='a'
                href={`https://www.google.com/search?q=${job.company_name}%20revenue`}
                target="_blank"
              >
                Revenue
              </Typography>
            </Stack>
            <Stack direction='row' spacing={2}>
              <Button variant="contained" href={job.apply_link} target='_blank' color='secondary'>
                Visit
              </Button>
              <Button variant="contained" onClick={setAppliedState} color={applied ? 'success' : 'primary'}>
                {applied ? 'Applied': 'Apply'}
              </Button>
            </Stack>
            <Typography
              py={2} variant='body1'
              dangerouslySetInnerHTML={{__html: description || ''}}
            />
          </Stack> : 'No job selected...'}
        </CardContent>
      </Card>
    </div>
  )
}

export default JobDetail;
