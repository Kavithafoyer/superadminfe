import React, { memo } from "react";
import GeneralApp from "./dashboard/GeneralApp";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { ChatProvider } from "./context/Chatcontext";

function MainChat() {
  return (
    <ChatProvider>
      <JumboContentLayoutMain>
        <GeneralApp />
      </JumboContentLayoutMain>
    </ChatProvider>
  );
}

export default memo(MainChat);
