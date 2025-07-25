import {io} from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () =>{
    console.log(socket.id);
    socket.emit("send-message", {data:"new"}, "4gBGeaXdPDlOO6HTAAAH");

    socket.on("receive-message", (msg) =>{
        console.log(msg.data);
    });
})

export default socket;