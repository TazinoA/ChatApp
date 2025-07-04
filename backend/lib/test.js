import axios from "axios";

axios.post("http://localhost:3000/api/message", {
 sender_id: 1,
 receiver_id:2,
 content:"hello"
}).then(response =>{
  console.log(response.data);
}).catch(err => {
  console.log(err.response.data);
})