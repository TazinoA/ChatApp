import "../styles/chat.css"
import SideBar from "../components/SideBar.jsx"
import NavBar from "../components/NavBar.jsx"
import Placeholder from "../components/Placeholder.jsx"
import Chat from "../components/Chat.jsx"
export default function ChatPage(){
    return <>
        <NavBar/>
        <div className="main-section">
            <SideBar/>
            {/* <Placeholder/> */}
            <Chat avatar = "https://randomuser.me/api/portraits/women/15.jpg" name = "Olivia Benson"/>
        </div>
    </>
}