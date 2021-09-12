const express = require("express") 
const http = require("http")
const cors = require("cors")
const app = express()
const server = http.createServer(app)
const socket = require("socket.io")
const router = require("./router.js")
const {addUser, deleteUser, getCurrentUser, getUsersInRoom} = require("./users.js")
require("dotenv").config()


const io = socket(server, {
	cors: {
		origin: process.env.CLIENT,
		methods: ["GET", "POST"],
	},
});

app.use(cors())
app.use(router)

io.on("connect",socket => {
  socket.on("join",({name, room}) => {
    const user = addUser(socket.id, name, room)
    socket.join(user.room)
    
    socket.emit("message", {
		user: "admin",
		text: `${user.name}, welcome to room ${user.room}.`,
	});
	
    socket.broadcast
		.to(user.room)
		.emit("message", { user: "admin", text: `${user.name} has joined!` });

	io.to(user.room).emit("roomUsers", {
		room: user.room,
		users: getUsersInRoom(user.room),
	});


  })

  socket.on("disconnect", ()=> {
    const deletedUser = deleteUser(socket.id)
    io.to(deletedUser.room).emit("message", {user: deletedUser.name, text:`${deleteUser.name} has left the room`})
  })

  socket.on("sendMessage", ({currentMessage, name, room}) => {
	io.to(room).emit("message", { user: name, text: currentMessage });   
  })


})

server.listen(process.env.PORT || 5000, ()=> console.log("server running")) 
