import { useContext } from "react";
import AuthContext from "../utils/AuthContext";
import { formatLastMessageTime } from "../utils/chatHelpers";

export default function Contact({ contact }) {
  const { setSelectedChat, onlineUserIds } = useContext(AuthContext);

  const contactId = contact.id;
  const isOnline = Array.isArray(onlineUserIds)
    ? onlineUserIds.includes(contactId)
    : onlineUserIds instanceof Set
    ? onlineUserIds.has(contactId)
    : false;

  const handleClick = () => {
    const selected = {
      contactId: contact.id,
      name: contact.name,
      profile_pic: contact.profile_pic || "/avatar.png",
      email: contact.email,
    };
    setSelectedChat(selected);
    localStorage.setItem("selectedChat", JSON.stringify(selected));
  };

  return (
    <button type="button" className="contact-card-btn" onClick={handleClick}>
      <div className="avatar-wrapper">
        <img
          className="avatar"
          src={contact.profile_pic || "/avatar.png"}
          alt={`${contact.name}'s avatar`}
        />
        <span className={`online-badge ${isOnline ? "active" : ""}`} />
      </div>

      <div className="contact-details">
        <div className="contact-top">
          <h3 className="contact-name">{contact.name}</h3>
          {contact.last_message_time && (
            <span className="last-msg-time">
              {formatLastMessageTime(contact.last_message_time)}
            </span>
          )}
        </div>
        <div className="contact-bottom">
          <p className="last-msg-text">
            {contact.last_message ? contact.last_message : "No messages yet"}
          </p>
        </div>
      </div>
    </button>
  );
}
