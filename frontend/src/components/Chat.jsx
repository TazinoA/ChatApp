export default function Chat(props){
    return <>
        <div className="chat-container">
            <header>
            <img className="avatar" src={props.avatar} alt={`${props.name}'s avatar`} />

            <div className="chat-info">
                <h3 className="contact-name">{props.name}</h3>
                <p className="status">Online</p>
            </div>

            <div className="action-buttons">
                <button className="back-btn"><img src = "https://cdn-icons-png.flaticon.com/128/3114/3114883.png"/></button>
                <button className="chat-settings"><img src = "https://cdn-icons-png.flaticon.com/128/1828/1828805.png"/></button>
            </div>
        </header>
        <div className="message-container"></div>
        <footer>
            <input type = "text"></input>
            <button>Photo</button>
            <button>Send</button>
        </footer>
        </div>
    </>
}