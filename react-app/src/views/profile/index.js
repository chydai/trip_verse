import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./helpers";
import Cover from "./components/Cover";
import MainContent from "./components/MainContent";

export default function Profile() {
  return (
    <ChakraProvider theme={theme}>
      <Cover />
      <MainContent />
    </ChakraProvider>
  );
}
