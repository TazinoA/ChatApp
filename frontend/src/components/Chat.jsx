import {createMessage} from "./Message.jsx";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../utils/AuthContext";
import { getMessages } from "../utils/api.js";

export default function Chat(props){
     const [messages, setMessages] = useState([]);
     const [currentMessage, setCurrentMessage] = useState("");
     const {authUser, setShowPlaceholder, selectedChat, socket} = useContext(AuthContext);

      useEffect(() =>{
          const fetchMessages = async () =>{
            const messages = await getMessages(selectedChat.contactId);
            setMessages(messages);
          }
          fetchMessages();
      },[selectedChat])

      useEffect(() =>{

        function onReceiveMessage(message){
            setMessages(prevMessages => [...prevMessages, message]);
        }

        socket.on("receive-message", onReceiveMessage);

        return () =>{
            socket.off("receive-message", onReceiveMessage);
        }
      }, [])


      useEffect(() => {
            const container = document.querySelector(".message-container");
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
      }, [messages]);

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
           {messages.length > 0 && authUser && selectedChat &&  messages.map(msg => createMessage(msg, authUser, selectedChat))}
        </div>
        <footer>
            <input 
            type = "text" 
            placeholder="Type a message..." 
            value = {currentMessage} 
            onChange = {(e) => {
                setCurrentMessage(e.target.value)
            }}></input>
            <button>Photo</button>
            <button onClick= {
                () =>{
                    if (currentMessage.trim() === "") return;

                    const messageToSend = {
                        senderid:authUser.id,
                        receiverid:selectedChat.contactId,
                        content:currentMessage,
                        timestamp: Date.now()
                    }
                    socket.emit("send-message", messageToSend);

                    setCurrentMessage("");
                }
            }>Send</button>
        </footer>
        </div>
    </>
}