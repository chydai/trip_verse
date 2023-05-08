import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

function Notifications() {
  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <FormLabel
        htmlFor="notificationMessage"
        mb={0}
        cursor="pointer"
        userSelect="none"
      >
        Receive notification Message
      </FormLabel>
      <Switch id="notificationMessage" />
    </FormControl>
  );
}

export default Notifications;
