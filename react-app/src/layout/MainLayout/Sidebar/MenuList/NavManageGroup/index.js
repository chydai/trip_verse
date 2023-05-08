import { forwardRef, useEffect, useState, useMemo } from "react";
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

// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";

import EditGroup from "./EditGroup";
import DeleteGroup from "./DeleteGroup";
import TransferGroup from "./TransferGroup";
import RemoveMember from "./RemoveMember";
// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavManageGroup = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const user = useSelector((store) => store.users);
  const isGroupOwner = useMemo(
    () => user?.currentUser?._id === item.groupObj?.userId,
    [user, item.groupObj]
  );
  const [open, setOpen] = useState(false);

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

  const itemHandler = async (id, name) => {
    setOpen(!open);
    dispatch(menuOpen(id));
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
      {isGroupOwner && (
        <>
          <ListItemButton
            disabled={item.disabled}
            sx={{
              borderRadius: `${customization.borderRadius}px`,
              mb: 0.5,
              alignItems: "flex-start",
              backgroundColor: level > 1 ? "transparent !important" : "inherit",
              py: level > 1 ? 1 : 1.25,
              pl: `${level * 24}px`,
            }}
            selected={
              customization.isOpen.findIndex((id) => id === item.id) > -1
            }
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
              <EditGroup item={item} />
              <DeleteGroup item={item} />
              <TransferGroup item={item} />
              <RemoveMember item={item} />
            </List>
          </Collapse>
        </>
      )}
    </>
  );
};

export default NavManageGroup;
