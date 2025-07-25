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
      <img className="avatar" src={props.profile_pic} alt={`${props.name}'s avatar`} />

      <div className="contact-info">
        <h3 className="contact-name">{props.name}</h3>
        <p className="status">Online</p>
      </div>
    </div>
  );
}

export function createContact(contact) {
  return (
    <Contact
      key={contact.id}
      contactId = {contact.id}
      profile_pic={contact.profile_pic || "/avatar.png"}
      name={contact.name}
    />
  );
}
