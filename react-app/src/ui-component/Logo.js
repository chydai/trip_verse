// material-ui
import Typography from "@mui/material/Typography";
import logo from "assets/images/logo.png";

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  return (
    <>
      <img src={logo} alt="tripverse" width="80" />
      <Typography
        variant="h3"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontWeight: 700,
          // letterSpacing: '.2rem',
          color: "inherit",
          textDecoration: "none",
        }}
      >
        TripVerse
      </Typography>
    </>
  );
};

export default Logo;
