// assets
import MainCard from "ui-component/cards/MainCard";
import GroupDetail from "./groupdetail/groupmessage";
import PerfectScrollbar from "react-perfect-scrollbar";

// ==============================|| MAIN LAYOUT ||============================== //

const GroupInfo = () => {
  return (
    <MainCard
      title="Group Info"
      data-testid="groupinfo-box"
      style={{ height: "600px" }}
    >
      <PerfectScrollbar
        component="div"
        style={{
          height: "480px",
        }}
      >
        <GroupDetail />
      </PerfectScrollbar>
    </MainCard>
  );
};

export default GroupInfo;
