import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  TextField,
  CardHeader,
  CardMedia
} from '@mui/material';
import { Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@emotion/react';
// import { planDeleted, planUpdated } from 'store/preTripPlanSlice';
// import { updatePlace, deletePlace } from 'store/preTripPlaceSlice';
import { useDispatch } from 'react-redux';

function DebtCard(props) {
  const theme = useTheme();
  // const [title, setTitle] = useState(props.title);
  // const [content, setContent] = useState(props.content);
  // const dispatch = useDispatch();

  return (
    <Card sx={{
      display: 'flex',
      justifyContent: 'space-between', 
      border: '2px solid',
      borderColor: theme.palette.success.light,
      ':hover': {
        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
      },
    }}>
      
    <>
        <Box sx={{ flexGrow:'1.5' }}>
          <CardContent sx={{ bgcolor: theme.palette.success.light, alignItems: 'center', pl: 1, pb: 1 }} >
              {
                props.content < 0 ? <Typography fontWeight='bold' fontSize={15} align="center" component="div" color="green">
                  You lent group member - {props.title}:           ${-1*props.content}
                </Typography> : <Typography fontWeight='bold' fontSize={15} align="center" component="div" color="green">
                  You owe group member - {props.title}:           ${props.content}
                </Typography>
              }
          </CardContent>
        </Box>
        <CardMedia
        component="img"
        sx={{ width: 80 }}
        image="https://firebasestorage.googleapis.com/v0/b/tpchatchat.appspot.com/o/dollar.png?alt=media&token=7fa721e4-bebb-4fe6-a8d9-50ccd978e899"
        alt="debts"
        />
    </>
    </Card >
  );
}

export default DebtCard;