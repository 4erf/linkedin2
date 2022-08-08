import './Query.scss'
import { QueryParamsFull } from '../types/QueryParams';
import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, FormControlLabel, FormGroup, Grid, Paper, TextField } from '@mui/material';

const initialSearch = `
(javascript OR python OR pytorch OR deep learning)
AND NOT (c# OR c++ OR java OR senior OR sr. OR php)
`.replaceAll('\n', ' ').trim()

interface Props {
  onQueryChange: (query: QueryParamsFull) => void;
}

function Query (props: Props) {
  const [search, setSearch] = useState<string>(initialSearch);
  const [staffValue, setStaffValue] = useState<number>(5000);
  const [staffWeight, setStaffWeight] = useState<number>(5);
  const [daysValue, setDaysValue] = useState<number>(15);
  const [daysWeight, setDaysWeight] = useState<number>(2);
  const [showSeen, setShowSeen] = useState<boolean>(false);

  function submit() {
    props.onQueryChange({ search, staffValue, staffWeight, daysValue, daysWeight, showSeen })
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
          <Grid item xs={2}>
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
