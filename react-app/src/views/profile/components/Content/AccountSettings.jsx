import { FormControl, FormLabel, Grid, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button } from '@chakra-ui/react';
import { Alert } from '@mui/material';
import { updateUser } from 'store/userSlice';

function AccountSettings() {
  const curUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState(curUser.email);
  const [firstName, setFirstName] = useState(curUser.firstName);
  const [lastName, setLastName] = useState(curUser.lastName);
  const [phoneNumber, setPhoneNumber] = useState(curUser.phone);

  const [showAlert, setShowAlert] = useState(-1);
  const [firstNameChanged, hasFirstNameChanged] = useState(false);
  const [lastNameChanged, hasLastNameChanged] = useState(false);
  const [phoneChanged, hasPhoneChanged] = useState(false);

  const [isUpdateClicked, setIsUpdateClicked] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(
        updateUser({
          _id: curUser._id,
          email,
          firstName,
          lastName,
          phone: phoneNumber,
        })
      );
      setShowAlert(1);
      setIsUpdateClicked(true);
    } catch (err) {
      setShowAlert(0);
      console.error('Failed to Update Profile: ', err);
    }

  };
  const handleFirstNameChange = (e) =>{
    setFirstName(e.target.value);
    hasFirstNameChanged(true);
  }

  const handleLastNameChange = (e) =>{
    setLastName(e.target.value);
    hasLastNameChanged(true);
  }
  const handlePhoneChange = (e) =>{
    setPhoneNumber(e.target.value);
    hasPhoneChanged(true);
  }



  return (
    <Box borderColor="brand.light" sx={{ paddingTop: 0 }}>
      <Box sx={{ mb: 2 }}>
        {showAlert === 0 && (
          <Alert onClose={() => setShowAlert(-1)} severity="error">
            You haven't updated your profile!
          </Alert>
        )}

        {showAlert === 1 && (
          <Alert onClose={() => setShowAlert(-1)} severity="success">
            You successfully updated your profile!
          </Alert>
        )}
      </Box>

      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        gap={12}
      >
        <FormControl id="firstName">
          <FormLabel>First Name</FormLabel>
          <Input
            focusBorderColor="brand.blue"
            type="text"
            onChange={handleFirstNameChange}
            placeholder={firstName}
            color={isUpdateClicked ? "gray.400" : "inherit"}
          />
        </FormControl>
        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input
            focusBorderColor="brand.blue"
            type="text"
            onChange={handleLastNameChange}
            placeholder={lastName}
            color={isUpdateClicked ? "gray.400" : "inherit"}
          />
        </FormControl>
        <FormControl id="phoneNumber">
          <FormLabel>Phone Number</FormLabel>
          <Input
            focusBorderColor="brand.blue"
            type="tel"
            onChange={handlePhoneChange}
            placeholder={phoneNumber}
            color={isUpdateClicked? "gray.400" : "inherit"}
          />
        </FormControl>
        <FormControl id="emailAddress">
          <FormLabel>Email Address</FormLabel>
          <Input
            focusBorderColor="brand.blue"
            type="email"
            isDisabled
            // onChange={(e) => setEmail(e.target.value)}
            placeholder={curUser.email}
          />
        </FormControl>

        <Box py={5} borderColor="brand.light">
          <Button onClick={handleSubmit}>Update</Button>
        </Box>
      </Grid>
    </Box>
  );
}

export default AccountSettings;
// update the color of user account information