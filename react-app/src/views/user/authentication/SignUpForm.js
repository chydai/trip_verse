import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import AnimateButton from "ui-component/extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";
import { signUpUser, logInUser } from "store/userSlice";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignUpForm = ({ ...others }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("123456");
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(2, "User name is too short")
            .max(50, "User name is too long")
            .required("User Name is required"),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Password is at least 6 character")
            .max(255)
            .required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const newUser = {
            name: values.name,
            password: values.password,
            email: values.email,
            avatarUrl: "https://firebasestorage.googleapis.com/v0/b/tpchatchat.appspot.com/o/a-ziyuan460.svg?alt=media&token=6b67b97a-ad4f-44df-8530-4d619a307c8c",
          };

          const loginUser = await dispatch(signUpUser(newUser));
          if (loginUser.error) {
            setStatus({ success: false });
            setErrors({ submit: loginUser.error.message });
            setSubmitting(false);
          } else {
            await dispatch(
              logInUser({
                email: values.email,
                password: values.password,
              })
            );
            setStatus({ success: true });
            setSubmitting(false);
            navigate("/");
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.name && errors.name)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-username-register">
                User Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-username-register"
                type="text"
                value={values.name}
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.name && errors.name && (
                <FormHelperText error id="standard-weight-helper-text-register">
                  {errors.name}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-register">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-register">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-register">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-register"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        style={{ backgroundColor: level?.color }}
                        sx={{ width: 85, height: 8, borderRadius: "7px" }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignUpForm;
