import './JobDetail.scss'
import { JobItem } from '../types/JobItem';
import { Button, Card, CardContent, Icon, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { Api } from '../services/Api';
import app from '../App';

interface Props {
  job: JobItem | null;
}

const useStyles = makeStyles({
  multiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical"
  }
});

function JobDetail(props: Props) {
  const { job } = props;
  const classes = useStyles();

  const [applied, setApplied] = useState(!!job?.applied);

  function setAppliedState() {
    Api.markJobAsApplied(job!.id, !applied)
    setApplied(!applied)
  }

  useEffect(() => {
    setApplied(!!job?.applied)
    document.getElementsByClassName('JobDetail')[0].scrollTo({ top: 0 })
  }, [job])

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
              <Icon color='disabled'>description</Icon>
              <Typography pl={2} variant='body2' className={classes.multiLineEllipsis} color='text.secondary'>
                {job.company_description}
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
              dangerouslySetInnerHTML={{__html: job.description}}
            />
          </Stack> : 'No job selected...'}
        </CardContent>
      </Card>
    </div>
  )
}

export default JobDetail;
