import { Container } from "@chakra-ui/layout";
import Content from "./Content/Content";
import VisitView from "./Content/VisitView";
import Sidebar from "./Sidebar/Sidebar";
import { useSelector } from "react-redux";
import { selectUserProfile } from "store/userSlice";
import { useParams } from "react-router";

export default function MainContent() {
  const curUser = useSelector(selectUserProfile);
  const curParams = useParams();

  return (
    <Container display={{ base: "block", md: "flex" }} maxW="container.xl">
      <Sidebar />
      {curUser._id === curParams.userid && <Content />}
      {curUser._id !== curParams.userid && <VisitView />}
    </Container>
  );
}
