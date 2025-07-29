import {io} from "socket.io-client";

const url = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/"

const socket = io(url, {
    autoConnect: false
});

export default socket;