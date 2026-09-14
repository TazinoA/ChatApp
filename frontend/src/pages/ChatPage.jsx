import "../styles/chat.css";
import SideBar from "../components/SideBar.jsx";
import NavBar from "../components/NavBar.jsx";
import Placeholder from "../components/Placeholder.jsx";
import Chat from "../components/Chat.jsx";
import { useContext } from "react";
import AuthContext from "../utils/AuthContext.js";

export default function ChatPage() {
  const { selectedChat } = useContext(AuthContext);

  return (
    <div className="app-page-layout">
      <NavBar />
      <main className="main-section">
        <SideBar />
        {!selectedChat ? <Placeholder /> : <Chat />}
      </main>
    </div>
  );
}
