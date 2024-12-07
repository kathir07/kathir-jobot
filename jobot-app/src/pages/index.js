import { useState } from "react";
import Head from "next/head";
import Markdown from 'react-markdown'

export default function Home() {
  const API_URL = "https://api.openai.com/v1/chat/completions"
  const SYSTEM_MESSAGE = "You are a Jobot, a helpful and versatile AI created by Kathir using state-of the are Ml models and APIs"


  const [apiKey, setApiKey] = useState('')
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {"role": "system", "content": SYSTEM_MESSAGE},
  ])



  const handleSendRequest = async () => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages)
    setUserMessage('')

    try {
      const response = await fetch(API_URL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
          body: JSON.stringify({
            "model": "gpt-4o-mini",
            "messages": updatedMessages,
          }),
        }
      );

      const responseJson = await response.json()

      const updatedMessages2 = [...updatedMessages, responseJson.choices[0].message];
      setMessages(updatedMessages2)

    } catch (error) {
      console.error("error");
      window.alert("Error:" + error.message);
    }
   
  }
  return (
   <>
   <Head>Jobot - Your Friendly Neighborhood AI</Head>
   <div className="flex flex-col h-screen">

    {/* Navigation Bar */}
    <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
      <div className="text-xl font-bold ">Jobot</div>
      <div className="flex flex-row">
        <input 
          type="password" 
          className="border p-1 rounded" 
          placeholder="Place API Key here.." 
          onChange={(e) => setApiKey(e.target.value)}
          value={apiKey}
          />
      </div>
    </nav>

    {/* Message History */}
    <div className="flex-1 overflow-y-scroll">
      <div className="mx-auto w-full max-w-screen-md p-4">
        {messages
              .filter((msg) => msg.role !== "system")
              .map((msg, idx) => {
                return (
                  <div key={idx} className="mt-3">
                     <div className="font-bold">
                    {msg.role === "user" ? "You" : "Jobot"}
                    </div>
                    <div className="prose-lg">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                  </div>
                )
              })
        }
      </div>

    </div>

    {/* Message Input Box */}
      <div className="mx-auto w-full max-w-screen-md px-4 pt-0 pb-2 flex">
        <textarea
              className="border rounded-md text-lg p-2 flex-1"
              rows={1}
              placeholder="Ask me anything..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
        <button 
        className="w-40 rounded-md px-2 border bg-blue-500 hover:bg-blue-600 text-white ml-2"
        onClick={handleSendRequest}
        >Send</button>
      </div>

   </div>
   </>
  );
}
