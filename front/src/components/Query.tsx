import './Query.scss'
import { QueryParamsFull } from '../types/QueryParams';
import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, FormControlLabel, FormGroup, Grid, Paper, TextField } from '@mui/material';

const initialSearch = `
(javascript OR python OR pytorch OR deep learning)
AND NOT (c# OR c++ OR java OR senior OR sr. OR php)
`.replaceAll('\n', ' ').trim()

const lsKey = 'linkedin^2_query';

interface Props {
  onQueryChange: (query: QueryParamsFull) => void;
}

function Query (props: Props) {
  const query: QueryParamsFull | null = JSON.parse(localStorage.getItem(lsKey) || 'null')

  const [search, setSearch] = useState<string>(query?.search ?? '');
  const [staffValue, setStaffValue] = useState<number>(query?.staffValue ?? 0);
  const [staffWeight, setStaffWeight] = useState<number>(query?.staffWeight ?? 0);
  const [daysValue, setDaysValue] = useState<number>(query?.daysValue ?? 0);
  const [daysWeight, setDaysWeight] = useState<number>(query?.daysWeight ?? 0);
  const [predWeight, setPredWeight] = useState<number>(query?.predWeight ?? 0);
  const [showSeen, setShowSeen] = useState<boolean>(query?.showSeen ?? false);
  const [showApplied, setShowApplied] = useState<boolean>(query?.showApplied ?? false);
  const [showLatest, setShowLatest] = useState<boolean>(query?.showLatest ?? false);

  function submit() {
    const query = {
      search, staffValue, staffWeight, daysValue, daysWeight,
      predWeight, showSeen, showApplied, showLatest
    };
    props.onQueryChange(query)
    localStorage.setItem(lsKey, JSON.stringify(query))
  }

  useEffect(() => {
    submit()
  }, []);

  return (
    <div className="Query">
      <Card sx={{ borderRadius: 0 }}>
        <Grid container spacing={2} pt={3} pb={2} px={2}>
          <Grid item xs={12}>
            <TextField
              label="Search"
              placeholder="Search"
              size="small"
              fullWidth
              multiline
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Employees"
              type="number"
              size="small"
              fullWidth
              InputProps={{
                inputProps: { min: 0 }
              }}
              value={staffValue}
              onChange={event => setStaffValue(+event.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Weight"
              type="number"
              size="small"
              fullWidth
              InputProps={{
                inputProps: { min: 0 }
              }}
              value={staffWeight}
              onChange={event => setStaffWeight(+event.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Days"
              type="number"
              size="small"
              fullWidth
              InputProps={{
                inputProps: { min: 0 }
              }}
              value={daysValue}
              onChange={event => setDaysValue(+event.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Weight"
              type="number"
              size="small"
              fullWidth
              InputProps={{
                inputProps: { min: 0 }
              }}
              value={daysWeight}
              onChange={event => setDaysWeight(+event.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Pred. Weight"
              type="number"
              size="small"
              fullWidth
              InputProps={{
                inputProps: { min: 0 }
              }}
              value={predWeight}
              onChange={event => setPredWeight(+event.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox
                  checked={showSeen}
                  onChange={event => setShowSeen(event.target.checked)}
                />}
                label="Seen"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox
                  checked={showApplied}
                  onChange={event => setShowApplied(event.target.checked)}
                />}
                label="Applied"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox
                  checked={showLatest}
                  onChange={event => setShowLatest(event.target.checked)}
                />}
                label="Latest"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={2} ml='auto'>
            <Button
              sx={{height: '100%'}}
              fullWidth
              variant="contained"
              onClick={submit}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default Query
