let users = []

const addUser = (id, name, room) => {
  const user = {id, name, room}
  users.push(user)
  return user
}

const deleteUser = id => {
  const newArrayOfUsers = users.filter(user => user.id !== id)
  users = newArrayOfUsers
  return newArrayOfUsers
}

const getCurrentUser = (name) => {
  const user = users.find(user => user.name === name)
  return user
}

const getUsersInRoom = room => {
  const usersInRoom = users.filter(user => user.room === room)
  return usersInRoom
}

module.exports = {addUser, deleteUser, getCurrentUser, getUsersInRoom}