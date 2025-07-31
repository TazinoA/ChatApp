import "../styles/chat.css"
import SideBar from "../components/SideBar.jsx"
import NavBar from "../components/NavBar.jsx"
import Placeholder from "../components/Placeholder.jsx"
import Chat from "../components/Chat.jsx"
import { useContext, useEffect } from "react"
import AuthContext from "../utils/AuthContext.js"

export default function ChatPage(){
    const {showPlaceholder,setShowPlaceholder, selectedChat} = useContext(AuthContext);

    useEffect(() => {
          if(selectedChat && !selectedChat.placeholder){
            setShowPlaceholder(false);
          }else{
            setShowPlaceholder(true);
          } 
    }, [selectedChat])
    
    return <>
        <NavBar/>
        <div className="main-section">
            <SideBar/>
            {showPlaceholder || selectedChat?.placeholder ? (<Placeholder />) : (<Chat profile_pic={selectedChat.profile_pic} name={selectedChat.name} />)}
            
        </div>
    </>
}