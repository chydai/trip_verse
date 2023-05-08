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

function ExpenseTotalCard(props) {
  const theme = useTheme();
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);

  return (
    <Card sx={{
      display: 'flex',
      justifyContent: 'space-between', 
      border: '4px solid',
      borderColor: theme.palette.secondary.light,
      ':hover': {
        boxShadow: '0 4px 28px 0 rgb(32 40 45 / 8%)'
      },
    }}>
      
    <>
        <Box sx={{ flexGrow:'1.5' }}>
        <CardContent sx={{bgcolor: theme.palette.secondary.light, alignItems: 'center', pl: 1, pb: 1 }} >
            <Typography fontWeight='bold' fontSize={25} align="center" component="div" variant="button" color="purple">
            {props.title}
            </Typography>
            <Typography>
                
            </Typography>
            <Typography fontWeight='bold' fontSize={20} align="center" variant="subtitle1" component="div" color="purple">
            ${props.content}
            </Typography>
        </CardContent>
        </Box>
    </>
      
      
    </Card >
  );
}

export default ExpenseTotalCard;