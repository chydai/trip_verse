import PropTypes from "prop-types";
import { forwardRef, useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  List,
  Collapse,
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project imports
import { menuOpen, setMenu } from "store/customizationSlice";
import EditChannel from "./EditChannel";
import DeleteChannel from "./DeleteChannel";
import GetChannelId from "./GetChannelId";
import Members from "./MembersChannel";
import RemoveChannelMember from "./RemoveChannelMember";
// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavChannel = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const [open, setOpen] = useState(false);

  // UseState for the channel name
  const [userId, setUserId] = useState("");
  const user = useSelector((store) => store.users);
  const channelList = useSelector((state) => state.channels.channelList);
  const curChannel = channelList.find((cur) => cur._id === item.id);

  const isChannelOwner = useMemo(
    () => user?.currentUser?._id === curChannel?.userId,
    [user, curChannel]
  );

  const Icon = item.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width:
          customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height:
          customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  let itemTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const itemHandler = async (id, name) => {
    setOpen(!open);
    dispatch(menuOpen(id));
    // I use the hook to get the channel creater id ?
    if (matchesSM) dispatch(setMenu(false));
  };

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split("/")
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch(menuOpen(item.id));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ListItemButton
        {...listItemProps}
        disabled={item.disabled}
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          mb: 0.5,
          alignItems: "flex-start",
          backgroundColor: level > 1 ? "transparent !important" : "inherit",
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
        }}
        selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
        onClick={() => itemHandler(item.id, item)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: !item?.icon ? 18 : 36 }}>
          {itemIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant={
                customization.isOpen.findIndex((id) => id === item.id) > -1
                  ? "h5"
                  : "body1"
              }
              color="inherit"
            >
              {item.title}
            </Typography>
          }
          secondary={
            item.caption && (
              <Typography
                variant="caption"
                sx={{ ...theme.typography.subMenuCaption }}
                display="block"
                gutterBottom
              >
                {item.caption}
              </Typography>
            )
          }
        />
        {item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
        {open ? (
          <IconChevronUp
            stroke={1.5}
            size="1rem"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
        ) : (
          <IconChevronDown
            stroke={1.5}
            size="1rem"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: "relative",
            "&:after": {
              content: "''",
              position: "absolute",
              left: "32px",
              top: 0,
              height: "100%",
              width: "1px",
              opacity: 1,
              background: theme.palette.primary.light,
            },
          }}
        >
          <GetChannelId item={item} />
          {isChannelOwner && (
            <>
              <EditChannel item={item} />
              <DeleteChannel item={item} />
              <RemoveChannelMember item={item} />
            </>
          )}
          <Members item={item} />
        </List>
      </Collapse>
    </>
  );
};

NavChannel.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavChannel;
