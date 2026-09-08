import {createMessage} from "./Message.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../utils/AuthContext";
import { getMessages } from "../utils/api.js";


export default function Chat(props){
     const [messages, setMessages] = useState([]);
     const [currentMessage, setCurrentMessage] = useState("");
     const [nextCursor, setNextCursor] = useState(null);
     const [hasMoreMessages, setHasMoreMessages] = useState(false);
     const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
     const messageContainerRef = useRef(null);
     const shouldScrollToBottom = useRef(true);
     const {authUser, setShowPlaceholder, selectedChat, socket, isConnected, userSocketMap} = useContext(AuthContext);

     const isOnline = userSocketMap ? selectedChat.contactId in userSocketMap: false

      useEffect(() =>{
          let cancelled = false;

          const fetchMessages = async () =>{
            try {
              const page = await getMessages(selectedChat.contactId);
              if (cancelled) return;

              setMessages(page.messages.reverse());
              setNextCursor(page.nextCursor);
              setHasMoreMessages(page.hasMore);
              shouldScrollToBottom.current = true;
            } catch (error) {
              console.error("Unable to load messages:", error);
            }
          }
          fetchMessages();
          return () => {
            cancelled = true;
          };
      },[selectedChat.contactId])

      const loadOlderMessages = async () => {
        if (!hasMoreMessages || loadingOlderMessages || !nextCursor) return;

        const container = messageContainerRef.current;
        const previousScrollHeight = container?.scrollHeight ?? 0;
        const previousScrollTop = container?.scrollTop ?? 0;
        setLoadingOlderMessages(true);

        try {
          const page = await getMessages(selectedChat.contactId, nextCursor);
          const olderMessages = page.messages.reverse();
          shouldScrollToBottom.current = false;
          setMessages((currentMessages) => [...olderMessages, ...currentMessages]);
          setNextCursor(page.nextCursor);
          setHasMoreMessages(page.hasMore);

          requestAnimationFrame(() => {
            if (container) {
              container.scrollTop = previousScrollTop + container.scrollHeight - previousScrollHeight;
            }
          });
        } catch (error) {
          console.error("Unable to load older messages:", error);
        } finally {
          setLoadingOlderMessages(false);
        }
      };

      useEffect(() =>{
        function onReceiveMessage(message){
            const isFromCurrentChat = message.senderid === selectedChat.contactId || message.receiverid === selectedChat?.contactId;

            if(isFromCurrentChat){
                setMessages(prevMessages => [...prevMessages, message]);
            }
        }

        socket.on("receive-message", onReceiveMessage);

        return () =>{
            socket.off("receive-message", onReceiveMessage);
        }
      }, [selectedChat?.contactId])


      useEffect(() => {
            const container = messageContainerRef.current;
            if (container && shouldScrollToBottom.current) {
                container.scrollTop = container.scrollHeight;
            }
            shouldScrollToBottom.current = true;
      }, [messages]);

    return <>
        <div className="chat-container">
            <header>
            <img className="avatar" src={props.profile_pic} alt={`${props.name}'s avatar`} />

            <div className="chat-info">
                <h3 className="contact-name">{props.name}</h3>
                <p className= {`status ${isOnline && "online"}`}>{isOnline ? "Online" : "Offline"}</p>
            </div>

            <div className="action-buttons">
                <button className="back-btn" onClick = {() => {
                    setShowPlaceholder(true);
                    localStorage.setItem("selectedChat", JSON.stringify({placeholder:true}))
                    }}><img src = "https://cdn-icons-png.flaticon.com/128/3114/3114883.png"/></button>
                {/* <button className="chat-settings"><img src = "https://cdn-icons-png.flaticon.com/128/1828/1828805.png"/></button> */}
            </div>
        </header>
        <div
          className="message-container"
          ref={messageContainerRef}
          onScroll={(event) => {
            if (event.currentTarget.scrollTop <= 40) {
              loadOlderMessages();
            }
          }}
        >
           {loadingOlderMessages && <p className="older-messages-loading">Loading older messages…</p>}
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
            {/* <button>Photo</button> */}
            <button onClick= {
                () =>{
                    if (!isConnected || currentMessage.trim() === ""){
                        return;
                    }

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
