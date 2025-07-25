export default function Message(props) {
  const { content, timestamp, isSent, profilePicUrl } = props;
  return (
    <div className={`text-container ${isSent ? 'sent' : 'received'}`}>
      <img className="profile-pic" src={profilePicUrl} alt="Profile" />
      <div className="message-bubble">
        <p className="content">{content}</p>
        <p className="timestamp">{timestamp}</p>
      </div>
    </div>
  );
}

export function createMessage(message, authUser, selectedChat){
  const defaultAvatar = "./avatar.png";
  const isSent = message.senderid === authUser.id

    const profilePicUrl = isSent ? authUser?.profile_pic || defaultAvatar : selectedChat.profile_pic|| defaultAvatar;
    const timestamp = formatDate(message.timestamp)

    return <Message
            key = {message.id}
            id = {message.id}
            content = {message.content}
            timestamp = {timestamp} 
            profilePicUrl = {profilePicUrl}
            isSent = {isSent}
         />
}

function formatDate(inputDate){
  const date = new Date(inputDate);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
