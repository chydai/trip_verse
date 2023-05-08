import { useDispatch, useSelector } from "react-redux";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Grid,
  Toolbar,
  useMediaQuery,
} from "@mui/material";

import { useParams } from "react-router";

// project imports
import Header from "layout/MainLayout/Header";
import Sidebar from "layout/MainLayout/Sidebar/groupSidebar";
import { drawerWidth, gridSpacing } from "store/constant";
import { setMenu } from "store/customizationSlice";

// assets
import TripPlan from "./tripplanner";
import GroupInfo from "./groupinfo";
import MapInfo from "./mapInfo";
import MyChatComponent from "./talk";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up("md")]: {
        marginLeft: -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
        width: `calc(100% - ${drawerWidth}px)`,
        padding: "16px",
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
        width: `calc(100% - ${drawerWidth}px)`,
        padding: "16px",
        marginRight: "10px",
      },
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
      },
    }),
  })
);

// ==============================|| MAIN LAYOUT ||============================== //

const GroupPage = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const route = useParams();
  const channelId = route.channelid;
  const groupId = route.groupid;

  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch(setMenu(!leftDrawerOpened));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        data-testid="mainlayout-appbar"
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened
            ? theme.transitions.create("width")
            : "none",
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar
        drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
      />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={5} style={{ height: "623.5px" }}>
                <MyChatComponent />
              </Grid>

              <Grid item xs={12} md={7} style={{ height: "700px" }}>
                {groupId && !channelId && <GroupInfo />}
                {groupId && channelId && <TripPlan />}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            style={{
              paddingTop: "0",
              marginTop: "-45px",
              marginLeft: "20px",
              width: "99.2%",
            }}
          >
            <MapInfo />
          </Grid>
        </Grid>
      </Main>
    </Box>
  );
};

export default GroupPage;
