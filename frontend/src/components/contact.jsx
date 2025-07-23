import { useContext } from "react";
import AuthContext from "../utils/AuthContext";

export default function Contact(props) {
    const {setShowPlaceholder, setSelectedChat} = useContext(AuthContext);

  return (
    <div className="contact" onClick = {() => {
      setShowPlaceholder(false);
      setSelectedChat(props);
      localStorage.setItem("selectedChat", JSON.stringify({
        ...props,
        placeholder:false
      }));
      }}>
      <img className="avatar" src={props.avatar} alt={`${props.name}'s avatar`} />

      <div className="contact-info">
        <h3 className="contact-name">{props.name}</h3>
        <p className="last-message">{props.lastMessage}</p>
      </div>

      <div className="meta-info">
        <p className="timestamp">{props.timestamp}</p>
        <span className="unread">1</span>
      </div>
    </div>
  );
}

export function createContact(contact) {
  return (
    <Contact
      key={contact.id}
      contactId = {contact.id}
      avatar={contact.avatar}
      name={contact.name}
      lastMessage={contact.lastMessage}
      timestamp={contact.timestamp}
    />
  );
}
