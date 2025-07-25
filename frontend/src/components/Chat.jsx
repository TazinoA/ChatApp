import {createMessage} from "./Message.jsx";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../utils/AuthContext";
import { getMessages } from "../utils/api.js";

export default function Chat(props){
     const [messages, setMessages] = useState([]);
     const {authUser, setShowPlaceholder, selectedChat} = useContext(AuthContext);

      useEffect(() =>{
          const fetchMessages = async () =>{
            const messages = await getMessages(selectedChat.contactId);
            setMessages(messages)
          }
          fetchMessages();
      },[selectedChat])

    return <>
        <div className="chat-container">
            <header>
            <img className="avatar" src={props.profile_pic} alt={`${props.name}'s avatar`} />

            <div className="chat-info">
                <h3 className="contact-name">{props.name}</h3>
                <p className="status">Online</p>
            </div>

            <div className="action-buttons">
                <button className="back-btn" onClick = {() => {
                    setShowPlaceholder(true)
                    localStorage.setItem("selectedChat", JSON.stringify({placeholder:true}))
                    }}><img src = "https://cdn-icons-png.flaticon.com/128/3114/3114883.png"/></button>
                {/* <button className="chat-settings"><img src = "https://cdn-icons-png.flaticon.com/128/1828/1828805.png"/></button> */}
            </div>
        </header>
        <div className="message-container">
           {messages.map(msg => createMessage(msg, authUser, selectedChat))}
        </div>
        <footer>
            <input type = "text" placeholder="Type a message..."></input>
            <button>Photo</button>
            <button>Send</button>
        </footer>
        </div>
    </>
}