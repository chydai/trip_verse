import { lazy } from "react";

// project imports
import Loadable from "ui-component/Loadable";

const GroupInfo = Loadable(lazy(() => import("views/group/groupinfo")));

const GroupDetailRoutes = {
  path: "/group-info",
  element: <GroupInfo />,
};

export default GroupDetailRoutes;
