import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    InputAdornment,
    OutlinedInput,
} from '@mui/material';

// assets
import {  IconSearch } from '@tabler/icons';

// ==============================|| PROFILE MENU ||============================== //

const SearchSection = () => {
    const theme = useTheme();
    const [value, setValue] = useState('');

    return(
        <>
        <OutlinedInput
            sx={{ width: '100%', pr: 1, pl: 2,}}
            id="input-search-profile"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search Travel Groups"
            startAdornment={
                <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{
                'aria-label': 'weight'
            }}
            />
        </>
    )
}





export default SearchSection;
