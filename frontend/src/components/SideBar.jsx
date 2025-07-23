import "../styles/chat.css"
import contacts from "../utils/contacts.js"
import {createContact} from "./contact.jsx";

export default function SideBar(){
    return <>
      <div className="sidebar-container">
        <div className="sidebar">
        <header>
            <img src = "https://cdn-icons-png.flaticon.com/128/11872/11872653.png"/>
            <h3>Contacts</h3>
            <div className="img-div">
            <img src= "https://cdn-icons-png.flaticon.com/128/1159/1159633.png"/>
            </div>
        </header>
       <div className="contacts">
        {contacts.map(contact => createContact(contact))}
       </div>
        </div>
      </div>
    </>
}