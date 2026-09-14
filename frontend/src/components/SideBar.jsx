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
  const { selectedChat } = useContext(AuthContext);

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
          contacts.map((contact) => <Contact key={contact.id} contact={contact} />)
        )}
      </div>
    </aside>
  );
}
