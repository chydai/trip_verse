import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    TextField,
    Box,
    Chip,
    Avatar,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    MenuItem
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { selectUserProfile } from 'store/userSlice';
import { selectAllChannels } from 'store/channelSlice';
import { getUser } from 'api/user';
import { editBill, deleteBill } from 'store/billSlice';

function ChipWithSelection(props) {
    const chipColor = props.selected ? "secondary" : "primary";

    return (
        <Chip
            avatar={<Avatar>{props.name[0]}</Avatar>}
            label={props.name}
            variant="outlined"
            onClick={props.onClick}
            color={chipColor}
        />
    );
}

function FieldWithAmount(props) {

    const handleBlur = (event) => {
        const value = event.target.value;
        if (value < 0) {
            event.target.value = "";
            alert("Please enter a positive number.");
        }
    }
    return (
        <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField
                    onBlur={handleBlur}
                    onChange={(event) => props.handleChange(event)}
                    placeholder="0"
                    type="number"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Chip
                                    avatar={<Avatar>{props.name[0]}</Avatar>}
                                    label={props.name}
                                    variant="outlined"
                                    color='secondary'
                                    sx={{ borderColor: 'white' }}

                                /> $
                            </InputAdornment>
                        ),
                    }}

                    variant="standard"
                />

            </Box>
        </Grid>
    );
}

const BillUpdate = (props) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const params = useParams();
    // console.log(props.bill)
    const channelList = useSelector(selectAllChannels);
    const curChannel = channelList.find(cur => cur._id === params.channelid)

    const [people, setPeople] = useState([]);
    const [selectedValue, setSelectedValue] = useState('equal');
    const [selectedChips, setSelectedChips] = useState([]);

    const [inputAmount, setInputAmount] = useState([]);
 
    const curUser = useSelector(selectUserProfile);

    const handleChangeSelect = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChipClick = (chipName) => {
        if (selectedChips.includes(chipName)) {
            setSelectedChips(selectedChips.filter((name) => name !== chipName));
        } else {
            setSelectedChips([...selectedChips, chipName]);
        }
    };

    const handleAmountChange= (index, value) => {
        setInputAmount(prevValues => {
            const newValues = [...prevValues];
            newValues[index] = value;
            return newValues;
          });
    }

    const handleDelete = () => {
        dispatch(deleteBill(props.bill._id))
        props.onClick()

    }

    useEffect(() => {
        Promise.all(
            curChannel.members.map((userId) =>
                getUser(userId)
                    .then((response) => response.data)
                    .catch((error) => {
                        console.error(`Error retrieving user ${userId}: ${error}`);
                    })
            )
        )
            .then((userObjects) => {
                const people = userObjects.map((user) => ({ name: user.name, id: user._id }));
                setPeople(people)
                console.log('p', people); // array of user objects
            })
            .catch((error) => {
                console.error(`Error retrieving users: ${error}`);
            });
    }, [])



    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Update This Expense</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    description: props.description,
                    amount: props.amount,
                    method: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    description: Yup.string().max(255).required('Description is required'),
                    amount: Yup.number().positive().required('Amount is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    const newBill = {...props.bill};
                    // console.log('?', newBill)
                    newBill.amount = values.amount
                    newBill.description= values.description
                    newBill.payer= curUser._id

                    if ( selectedChips.length >0 && selectedValue === 'equal') {
                        const equalDebt = values.amount / (selectedChips.length + 1);
                        const curDebt = (selectedChips).map((chipName) => {
                            const userID = people.find(p => p.name === chipName).id
                            return { user: userID, balance: equalDebt }
                        }
                        );
                        newBill.debt = curDebt;
                        console.log('newbill', newBill)

                    } else if (selectedValue === 'byamount') {
                        let debtSum = 0
                        const curDebt = (inputAmount).map((amount, index) => {
                            const numAmount = parseFloat(amount)
                            debtSum = debtSum + numAmount
                            return { user: people[index].id, balance: numAmount }
                        }
                        );
                        if(debtSum !== values.amount){
                            console.log("The sum of input doesn't match the total Amount")
                            setStatus({ success: false });
                            setSubmitting(false);
                            setErrors({ submit: "The sum of input doesn't match the total Amount" });
                        } else {
                            newBill.debt = curDebt;
                            console.log(props)
                        }                        
                    }
                    console.log('?', newBill)
                    dispatch(editBill(newBill))
                    setStatus({ success: true });
                    setSubmitting(false);
                    props.onClick()
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} >
                        <FormControl
                            fullWidth
                            error={Boolean(touched.description && errors.description)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-username-register">Description</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username-register"
                                value={values.description}
                                type='text'
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.description && errors.description && (
                                <FormHelperText error id="standard-weight-helper-text-register">
                                    {errors.description}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.amount && errors.amount)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type='number'
                                value={values.amount}
                                name="amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                }
                                label="Amount"
                                inputProps={{}}
                            />
                            {touched.amount && errors.amount && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.amount}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            sx={{ ...theme.typography.customInput }}
                        >
                            <FormHelperText sx={{ ml: 1 }}>Please select your split method</FormHelperText>
                            <TextField
                                id="split-method"
                                select
                                defaultValue={selectedValue}
                                onChange={handleChangeSelect}

                            >
                                <MenuItem key="equal" value="equal">
                                    Split Equally
                                </MenuItem>
                                <MenuItem key="by-amount" value="byamount">
                                    Split by Amount
                                </MenuItem>
                            </TextField>

                        </FormControl>

                        {selectedValue === 'equal' ?
                            (<>
                                <FormHelperText sx={{ ml: 1 }}>Please select which people owe an equal share</FormHelperText>

                                <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                    {people.map((temp, index) => {
                                        if (!(temp.name === curUser.name)) {
                                            return <ChipWithSelection
                                                key={index}
                                                name={temp.name}
                                                selected={selectedChips.includes(temp.name)}
                                                onClick={() => handleChipClick(temp.name)}
                                            />
                                        }
                                    })}
                                </Stack>
                            </>) : null}

                        {selectedValue === 'byamount' ?
                            (<>
                                <FormHelperText sx={{ ml: 1 }}>Please specify how much each person owes.</FormHelperText>
                                {errors.submit && (
                                    <Box sx={{ mt: 3 }}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Box>
                                )}
                                <Grid container spacing={2} >
                                    {people.map((temp, index) => (
                                        <FieldWithAmount
                                            key={index}
                                            name={temp.name}
                                            value={inputAmount[index]}
                                            handleChange={(event) => handleAmountChange(index, event.target.value)}
                                        />
                                    ))}
                                </Grid>
                            </>) : null}

                        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                disableElevation
                                onClick={handleDelete}
                                size="large"
                                variant="contained"
                                color="secondary"
                                sx={{ ml: 1 }}

                            >
                                Delete
                            </Button>
                            <Button
                                disableElevation
                                // onClick={props.onClick}
                                size="large"
                                type="submit"
                                variant="outlined"
                                color="secondary"
                                sx={{ ml: 1 }}

                            >
                                Save
                            </Button>
                            <Button
                                disableElevation
                                onClick={props.onClick}
                                size="large"
                                variant="outlined"
                                color="secondary"
                                sx={{ ml: 1 }}

                            >
                                Cancel
                            </Button>
                        </Box>


                    </form>
                )}
            </Formik>
        </>
    );
};

export default BillUpdate;

