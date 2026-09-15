import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../utils/AuthContext";
import { getMessages } from "../utils/api.js";
import Message from "./Message.jsx";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [sendError, setSendError] = useState("");

  const messageContainerRef = useRef(null);
  const isNearBottomRef = useRef(true);

  const { authUser, selectedChat, setSelectedChat, socket, onlineUserIds } =
    useContext(AuthContext);

  const contactId = selectedChat?.contactId ?? selectedChat?.id;
  const numericContactId = contactId ? Number(contactId) : null;

  const isOnline = Array.isArray(onlineUserIds)
    ? onlineUserIds.map(Number).includes(numericContactId)
    : onlineUserIds instanceof Set
    ? onlineUserIds.has(numericContactId)
    : false;

  useEffect(() => {
    let cancelled = false;

    const fetchInitialMessages = async () => {
      if (!contactId) return;
      setSendError("");
      try {
        const page = await getMessages(contactId);
        if (cancelled) return;

        setMessages(page.messages || []);
        setNextCursor(page.nextCursor || null);
        setHasMoreMessages(!!page.hasMore);

        requestAnimationFrame(() => {
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }
        });
      } catch (error) {
        console.error("Unable to load messages:", error);
      }
    };

    fetchInitialMessages();
    return () => {
      cancelled = true;
    };
  }, [contactId]);

  const loadOlderMessages = async () => {
    if (!hasMoreMessages || loadingOlderMessages || !nextCursor || !contactId) return;

    const container = messageContainerRef.current;
    const previousScrollHeight = container?.scrollHeight ?? 0;
    const previousScrollTop = container?.scrollTop ?? 0;
    setLoadingOlderMessages(true);

    try {
      const page = await getMessages(contactId, nextCursor);
      const olderMessages = page.messages || [];

      setMessages((currentMessages) => [...olderMessages, ...currentMessages]);
      setNextCursor(page.nextCursor || null);
      setHasMoreMessages(!!page.hasMore);

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

  useEffect(() => {
    if (!socket || !contactId) return;

    function onReceiveMessage(message) {
      const msgSenderId = Number(message.senderid);
      const msgReceiverId = Number(message.receiverid);
      const activeContactId = Number(contactId);

      const isFromCurrentChat =
        msgSenderId === activeContactId || msgReceiverId === activeContactId;

      if (isFromCurrentChat) {
        setMessages((prevMessages) => {
          if (prevMessages.some((m) => Number(m.id) === Number(message.id))) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });

        const isSentByMe = Number(message.senderid) === Number(authUser?.id);
        if (isSentByMe || isNearBottomRef.current) {
          requestAnimationFrame(() => {
            if (messageContainerRef.current) {
              messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
          });
        }
      }
    }

    function onErrorMessage(err) {
      setSendError(err.message || "Failed to send message");
    }

    socket.on("receive-message", onReceiveMessage);
    socket.on("error-message", onErrorMessage);

    return () => {
      socket.off("receive-message", onReceiveMessage);
      socket.off("error-message", onErrorMessage);
    };
  }, [socket, contactId, authUser?.id]);

  const handleScroll = (e) => {
    const container = e.currentTarget;
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = distanceToBottom < 120;

    if (container.scrollTop <= 30) {
      loadOlderMessages();
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    setSendError("");

    const trimmed = currentMessage.trim();
    if (!trimmed) return;

    if (socket && !socket.connected) {
      socket.connect();
    }

    const messageToSend = {
      receiverid: numericContactId,
      content: trimmed,
    };

    socket.emit("send-message", messageToSend);
    setCurrentMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleBack = () => {
    setSelectedChat(null);
    localStorage.removeItem("selectedChat");
  };

  if (!selectedChat) return null;

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button type="button" className="back-btn" onClick={handleBack} title="Back to chats">
          <ArrowLeft />
        </button>

        <div className="avatar-wrapper">
          <img
            className="avatar"
            src={selectedChat.profile_pic || "/avatar.png"}
            alt={`${selectedChat.name}'s avatar`}
          />
          <span className={`online-badge ${isOnline ? "active" : ""}`} />
        </div>

        <div className="chat-info">
          <h3 className="contact-name">{selectedChat.name}</h3>
          <p className={`status ${isOnline ? "online" : ""}`}>{isOnline ? "Online" : "Offline"}</p>
        </div>
      </header>

      <div className="message-container" ref={messageContainerRef} onScroll={handleScroll}>
        {loadingOlderMessages && (
          <div className="older-messages-loading">
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
            <span>Loading older messages...</span>
          </div>
        )}

        {messages.map((msg) => (
          <Message key={msg.id} message={msg} authUser={authUser} selectedChat={selectedChat} />
        ))}
      </div>

      {sendError && <div className="send-error-banner">{sendError}</div>}

      <footer className="chat-footer">
        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" className="send-btn" disabled={!currentMessage.trim()}>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
