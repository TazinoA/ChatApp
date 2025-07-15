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

export function createMessage(message){
    return <Message
            key = {message.id}
            content = {message.content}
            timestamp = {message.timestamp} 
            profilePicUrl = {message.profilePicUrl}
            isSent = {message.isSent}
         />
}
