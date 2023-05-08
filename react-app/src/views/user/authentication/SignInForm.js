import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

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
import { logInUser } from "store/userSlice";
// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignInForm = ({ ...others }) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
              Sign in with Email Address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          name: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .max(255)
            .email("Must be a valid email")
            .required("Email Address is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const loginUser = await dispatch(
            logInUser({
              email: values.name,
              password: values.password,
            })
          );

          if (loginUser.error) {
            console.log(loginUser.error);
            setStatus({ success: false });
            setErrors({ submit: loginUser.error.message });
            setSubmitting(false);
          } else {
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
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-username-register"
                type="email"
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
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
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
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

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
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignInForm;
