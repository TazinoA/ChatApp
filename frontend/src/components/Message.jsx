import { formatDate } from "../utils/chatHelpers";

export default function Message({ message, authUser, selectedChat }) {
  const defaultAvatar = "/avatar.png";
  const isSent = message.senderid === authUser?.id;

  const profilePicUrl = isSent
    ? authUser?.profile_pic || defaultAvatar
    : selectedChat?.profile_pic || defaultAvatar;

  const formattedTimestamp = formatDate(message.timestamp);

  return (
    <div className={`text-container ${isSent ? "sent" : "received"}`}>
      {!isSent && <img className="profile-pic" src={profilePicUrl} alt="Sender Profile" />}
      <div className="message-bubble">
        <p className="content">{message.content}</p>
        <span className="timestamp">{formattedTimestamp}</span>
      </div>
      {isSent && <img className="profile-pic" src={profilePicUrl} alt="Your Profile" />}
    </div>
  );
}
