import './JobListItem.scss'
import { Avatar, Checkbox, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ResultItem } from '../types/ResultItem';
import Moment from 'react-moment';
import { Api } from '../services/Api';

interface Props {
  item: ResultItem;
  selected: boolean;
  onItemSelect: () => void;
}

function JobListItem(props: Props) {
  const { item } = props;

  const [seen, setSeen] = useState(item.seen);

  function setSeenState(e: React.ChangeEvent<HTMLInputElement>) {
    const newSeen = e.target.checked
    Api.markJobAsSeen(item.id, newSeen)
    setSeen(newSeen)
  }

  return (
    <ListItem
      disablePadding
      alignItems="flex-start"
      secondaryAction={
        <Checkbox edge="end" checked={seen} onChange={setSeenState} />
      }
    >
      <ListItemButton onClick={props.onItemSelect} selected={props.selected}>
        <ListItemAvatar>
          <Avatar
            alt={item.company_name}
            src={item.company_logo}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography fontWeight="bold">
              {item.title}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Stack>
                <Typography
                  variant="body2"
                  color="text.primary"
                >
                  {item.company_name}
                </Typography>
                <Typography variant="body2">
                  {item.location} {item.remote_allowed && '(Hybrid)'}
                </Typography>
                <Stack direction='row' mt={0.5}>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="caption"
                  >
                    <Moment fromNow>{item.listed_at}</Moment>
                  </Typography>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="caption"
                  >
                    &nbsp;&#183; {item.company_staff_count} employees
                  </Typography>
                </Stack>
              </Stack>
            </React.Fragment>
          }
        />
      </ListItemButton>
    </ListItem>
  )
}
export default JobListItem;
