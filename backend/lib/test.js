import {api} from "./utils.js"

api.post("/api/message", {
 sender_id: 3,
 receiver_id:4,
 content:"message"
}).then(response =>{
  console.log(response.data);
}).catch(err => {
  console.log(err);
})

