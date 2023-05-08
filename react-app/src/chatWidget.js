import React, { useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import { Configuration, OpenAIApi } from "openai";

import "react-chat-widget/lib/styles.css";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function App() {
  useEffect(() => {
    addResponseMessage("Hello! I am your travel assistant.");
  }, []);

  const handleNewUserMessage = async (newMessage) => {
    // console.log(`New message incoming! ${newMessage}`);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: newMessage }],
    });
    addResponseMessage(completion.data.choices[0].message.content);
  };

  return (
    <div className="ChatWidget">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Travel Assistant"
        subtitle="powered by chatGPT"
      />
    </div>
  );
}

export default App;
