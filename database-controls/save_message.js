const Message = require('../models/message');
const User = require('../models/user');
const Chatroom = require('../models/chatroom');

function saveMessage(content, user, chatroom, timestamp, signature) {
	let newMessage = {content: '', user: '', chatroom: '', timestamp: Date.now(), signature: ''};
	let _createdMessage;
	newMessage.content = content;
	newMessage.user = user;
	newMessage.chatroom = chatroom;
	newMessage.timestamp = timestamp;
	newMessage.signature = signature;

	return new Promise((resolve, reject) => {
		Message.create(newMessage)
			.then((createdMessage) => {
				_createdMessage = createdMessage;
				return Chatroom.findById(chatroom);
			})
			.then((dbChatroom) => {
				dbChatroom.messages.push(_createdMessage._id);
				return dbChatroom.save();
			})
			.then(() => {
				return User.findById(user);
			})
			.then((dbUser) => {
				dbUser.messages.push(_createdMessage._id);
				return dbUser.save();
			})
			.then(() => {
				resolve(_createdMessage);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = saveMessage;