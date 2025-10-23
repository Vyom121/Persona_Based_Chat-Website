import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { Loader2 } from "lucide-react";

// Persona Selector
const Personaselector = ({ personas, selectedPersona, onSelect }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 h-full">
      <div className="bg-blue-300 w-full text-center py-2">
        <CardTitle className="text-3xl font-bold">Select Persona</CardTitle>
      </div>

      <div className="flex flex-col gap-4 mt-2 w-full">
        {personas.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;
          return (
            <Button
              key={persona.id}
              onClick={() => onSelect(persona)}
              size="lg"
              className={`flex flex-col items-center justify-center gap-2 w-full h-60 py-4 transition-all duration-200
                ${isSelected ? "bg-blue-200 shadow-lg" : "bg-white"}
              `}
            >
              <Avatar className={`h-24 w-24 ${isSelected ? "ring-2 ring-blue-400" : ""}`}>
                <AvatarImage
                  src={persona.image}
                  alt={persona.name}
                />
                <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center text-center">
                <span className={`font-bold text-4xl ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                  {persona.name}
                </span>
                <Badge variant="secondary" className='text-2xl'>{persona.role}</Badge>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// Chat Message Component
const MessageBubble = ({ message, sender }) => {
  const isUser = sender === "user";
  return (
    <div className={`flex w-full my-2 ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-xs px-4 py-2 my-2 rounded-lg text-xl ${
        isUser ? "bg-blue-300 text-gray-800 self-end" : "bg-gray-300 text-black self-start"
      }`}
    >
      <div className="text-xl text-blue-950 font-bold">{isUser ? "You" : message.agent_name || sender}</div>
      {message}
    </div>
  </div>
  );
};

const MessageInput = ({ input, setInput, onSend }) => {
  const handleSend = () => {
    if (input.trim() !== "") {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex gap-3 mt-4 items-center">
      <textarea
  value={input}
  onChange={(e) => {
    setInput(e.target.value);
    e.target.style.height = "auto"; // reset height
    e.target.style.height = e.target.scrollHeight + "px"; // adjust to content
  }}
  placeholder="Type your message..."
  rows={1}
  className="flex-1 resize-none overflow-hidden text-xl rounded-lg border-2 border-blue-300 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
/>
      <Button onClick={handleSend} className="px-6 py-3 text-xl bg-blue-300 ">Send</Button>
    </div>
  );
};
function App() {
  const PERSONAS = [
    { id: 1, name: "Hitesh Choudhary", role: "CEO ChaiCode", image: "https://avatars.githubusercontent.com/u/11613311?v=4" },
    { id: 2, name: "Piyush Garg", role: "Tech Enthusiast", image: "https://www.piyushgarg.dev/_next/image?url=%2Fimages%2Favatar.png&w=1080&q=75" },
  ];
  const [selectedPersona, setPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! How can I assist you today?", agent_name: selectedPersona.name }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (msg) => {
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    try {
      setLoading(true);
      const result = await axios.post("api/chat", { role: "user", content: msg, persona: selectedPersona.name });
      setMessages((prev) => [...prev, { role: "assistant", content: result.data.message, agent_name: selectedPersona.name }]);

    } catch (err) {
      console.error("Error communicating with server:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex bg-blue-300 p-6">
      {/* Left 1/4th: Persona Selector */}
      <div className="w-1/4">
        <Personaselector
          personas={PERSONAS}
          selectedPersona={selectedPersona}
          onSelect={setPersona}
        />
      </div>

      {/* Right 3/4th: Chat / Main Area */}
      <div className="w-3/4 pl-6 flex flex-col">
        <Card className="flex-1 flex flex-col h-full">
          <CardHeader className="bg-blue-200 p-4 rounded-t-lg">
            <CardTitle className="text-4xl mb-2 mt-3 text-center">Chatting with {selectedPersona.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 bg-white rounded-lg shadow-inner overflow-y-auto">
              {messages.map((msg,index)=>(
                <MessageBubble key={index} message={msg.content} sender={msg.role==="user"?"user":msg.agent_name} />
              ))}
              {loading && (
                  <div className="flex w-full my-2 justify-start">
                  <div className="flex items-center gap-2 bg-gray-300 text-black px-4 py-2 rounded-lg max-w-xs">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
                    <span>Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
          </CardContent>
          <div className="p-4 bg-gray-100 rounded-b-lg">
            <MessageInput input={input} setInput={setInput} onSend={handleSendMessage} />
          </div>
        </Card>
      </div>
    </div>
  );
}
export default App;

