const bcrypt = require("bcrypt")
const UserChat = require("../models/userChat")
const Message = require("../models/message")
class userChatController {
  sendMsgToAdmin = async (req, res) => {
    const { id, message } = req.body
    console.log(req.body)
    const messageObj = await Message.findOne({ id })
    if (!messageObj) {
      res.status(200).json({
        success: false,
        message: "Chưa khởi tạo tin nhắn"
      })
    }
    messageObj.chat.push({
      message,
      time: new Date(),
      senderId: id
    })
    await messageObj.save()
    const userChat = await UserChat.findOne({ username: id })
    userChat.chat = {
      id,
      lastMessage: { message, time: new Date(), senderId: id },
      unseenMsgs: ++userChat.chat.unseenMsgs
    }
    await userChat.save()
    res.status(200).json({
      message: "Thành công"
    })
  }

  sendMsgToUser = async (req, res) => {
    const { id, message } = req.body
    const messageObj = await Message.findOne({ id })

    messageObj.chat.push({
      message,
      time: new Date(),
      senderId: "admin"
    })
    await messageObj.save()
    const userChat = await UserChat.findOne({ username: id })
    userChat.chat = {
      id,
      lastMessage: { message, time: new Date(), senderId: "admin" },
      unseenMsgs: 0
    }
    await userChat.save()
    res.status(200).json({
      message: "Thành công"
    })
  }

  getChat = async (req, res) => {
    const { id } = req.query

    const message = await Message.findOne({ id }).exec()
    const userChat = await UserChat.findOne({ id: id }).exec()
    userChat.chat = {
      ...userChat.chat,
      unseenMsgs: 0
    }
    await userChat.save()
    res.status(200).json({
      message,
      userChat
    })
  }

  getAllUser = async (req, res) => {
    UserChat.find()
      .sort({ "chat.lastMessage.time": -1 })
      .then((result) => {
        res.status(200).json({
          users: result
        })
      })
      .catch((err) => {
        res.status(200).json({
          message: "Thất bại",
          err: err.message
        })
      })
  }

  addChatUser = async (req, res) => {
    const check = await UserChat.findOne({ username: req.body.name }).exec()
    if (check) {
      res.status(200).json({
        message: "Thất bại"
      })
    } else {
      const userChat = new UserChat({
        username: req.body.name,
        fullName: req.body.name,
        chat: {
          id: req.body.name,
          unseenMsgs: 0,
          lastMessage: {}
        }
      })
      await new Message({
        id: req.body.name,
        userId: req.body.name
      }).save()
      userChat.save().then((resulst) => {
        res.status(200).json({
          message: "Thành công",
          resulst
        })
      })
    }
  }
}

module.exports = new userChatController()
