import { useContext } from "react";
import AuthContext from "../utils/AuthContext";
import { formatLastMessageTime } from "../utils/chatHelpers";

export default function Contact({ contact, isSelected, onSelect }) {
  const { onlineUserIds } = useContext(AuthContext);

  const contactId = Number(contact.id);
  const isOnline = Array.isArray(onlineUserIds)
    ? onlineUserIds.map(Number).includes(contactId)
    : onlineUserIds instanceof Set
    ? onlineUserIds.has(contactId)
    : false;

  const hasUnread = Boolean(contact.hasUnread);

  const handleClick = () => {
    if (onSelect) {
      onSelect(contact);
    }
  };

  return (
    <button
      type="button"
      className={`contact-card-btn ${isSelected ? "selected" : ""} ${hasUnread ? "has-unread" : ""}`}
      onClick={handleClick}
    >
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
          <h3 className={`contact-name ${hasUnread ? "unread-text" : ""}`}>{contact.name}</h3>
          {contact.last_message_time && (
            <span className={`last-msg-time ${hasUnread ? "unread-time" : ""}`}>
              {formatLastMessageTime(contact.last_message_time)}
            </span>
          )}
        </div>
        <div className="contact-bottom">
          <p className={`last-msg-text ${hasUnread ? "unread-text" : ""}`}>
            {contact.last_message ? contact.last_message : "No messages yet"}
          </p>
          {hasUnread && <span className="unread-dot" title="Unread messages" />}
        </div>
      </div>
    </button>
  );
}
