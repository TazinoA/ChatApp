import { useEffect, useState, useContext } from "react";
import { getContacts } from "../utils/api";
import Contact from "./contact.jsx";
import AuthContext from "../utils/AuthContext";
import { Search, Loader2, RefreshCw } from "lucide-react";

export default function SideBar() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedChat, setSelectedChat, socket, authUser } = useContext(AuthContext);

  const fetchContacts = async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts(search);
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error("Failed to load contacts:", err);
      setError("Failed to load contacts. Please try again.");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // When selectedChat changes, clear unread status for that contact
  useEffect(() => {
    if (selectedChat?.contactId) {
      const activeId = Number(selectedChat.contactId);
      setContacts((prevContacts) =>
        prevContacts.map((c) => {
          if (Number(c.id) === activeId) {
            return { ...c, hasUnread: false };
          }
          return c;
        })
      );
    }
  }, [selectedChat]);

  // Listen for real-time messages to update sidebar contacts & unread indicator
  useEffect(() => {
    if (!socket || !authUser?.id) return;

    function handleReceiveMessage(message) {
      const senderId = Number(message.senderid);
      const receiverId = Number(message.receiverid);
      const currentUserId = Number(authUser.id);

      const otherUserId = senderId === currentUserId ? receiverId : senderId;
      const isCurrentSelectedChat =
        selectedChat?.contactId && Number(selectedChat.contactId) === otherUserId;

      setContacts((prevContacts) => {
        const existingIndex = prevContacts.findIndex(
          (c) => Number(c.id) === otherUserId
        );

        if (existingIndex !== -1) {
          const targetContact = { ...prevContacts[existingIndex] };
          targetContact.last_message = message.content;
          targetContact.last_message_time = message.timestamp;
          targetContact.last_message_sender_id = message.senderid;

          // If message received from contact and chat is NOT currently open with them, mark unread
          if (senderId !== currentUserId && !isCurrentSelectedChat) {
            targetContact.hasUnread = true;
          }

          const updatedList = prevContacts.filter(
            (c) => Number(c.id) !== otherUserId
          );
          return [targetContact, ...updatedList];
        } else {
          // If contact isn't in current search view, refetch contacts
          fetchContacts(searchTerm);
          return prevContacts;
        }
      });
    }

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, authUser?.id, selectedChat?.contactId, searchTerm]);

  const handleSelectContact = (contact) => {
    const selected = {
      contactId: contact.id,
      name: contact.name,
      profile_pic: contact.profile_pic || "/avatar.png",
      email: contact.email,
    };
    setSelectedChat(selected);
    localStorage.setItem("selectedChat", JSON.stringify(selected));

    setContacts((prevContacts) =>
      prevContacts.map((c) =>
        Number(c.id) === Number(contact.id) ? { ...c, hasUnread: false } : c
      )
    );
  };

  return (
    <aside className={`sidebar-container ${selectedChat ? "has-selected-chat" : ""}`}>
      <header className="sidebar-header">
        <div className="sidebar-title">
          <h2>Chats</h2>
        </div>
        <button
          type="button"
          className="refresh-btn"
          onClick={() => fetchContacts(searchTerm)}
          title="Refresh contacts"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <div className="sidebar-search">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="contacts-list">
        {loading ? (
          <div className="sidebar-state-container">
            <Loader2 className="animate-spin text-primary" />
            <p>Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="sidebar-state-container error">
            <p>{error}</p>
            <button type="button" onClick={() => fetchContacts(searchTerm)}>
              Retry
            </button>
          </div>
        ) : contacts.length === 0 ? (
          <div className="sidebar-state-container empty">
            <p>{searchTerm ? "No contacts found matching search" : "No contacts available"}</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <Contact
              key={contact.id}
              contact={contact}
              isSelected={Number(selectedChat?.contactId) === Number(contact.id)}
              onSelect={handleSelectContact}
            />
          ))
        )}
      </div>
    </aside>
  );
}
