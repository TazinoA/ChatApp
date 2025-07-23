import "../styles/chat.css"
import {useEffect, useState} from "react";
import { getContacts } from "../utils/api";
import {createContact} from "./contact.jsx";

export default function SideBar(){
      const [contacts, setContacts] = useState([])
  useEffect(() =>{
      const fetchContacts = async () =>{
        const contacts = await getContacts();
        setContacts(contacts)
      }
      fetchContacts();
  },[])

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