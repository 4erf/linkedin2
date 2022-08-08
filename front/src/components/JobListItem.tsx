import './JobListItem.scss'
import { Avatar, Checkbox, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import React from 'react';
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

  function setState(e: React.ChangeEvent<HTMLInputElement>) {
    Api.markJobAsSeen(item.id, e.target.checked)
  }

  return (
    <ListItem
      disablePadding
      alignItems="flex-start"
      secondaryAction={
        <Checkbox edge="end" onChange={setState} />
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
