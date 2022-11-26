const bcrypt = require("bcrypt")
const User = require("../models/user")
const Message = require("../models/message")
class userChatController {
  sendMsgToAdmin = async (req, res) => {
    const { id, message } = req.body
    const messageObj = await Message.findOne({ id })
    messageObj.chat.push({
      message,
      time: new Date(),
      senderId: id
    })
    await messageObj.save()
    const user = await User.findOne({ username: id })
    user.chat = {
      id,
      lastMessage: { message, time: new Date(), senderId: id },
      unseenMsgs: ++user.chat.unseenMsgs
    }
    await user.save()
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
    const user = await User.findOne({ username: id })
    user.chat = {
      id,
      lastMessage: { message, time: new Date(), senderId: "admin" },
      unseenMsgs: 0
    }
    await user.save()
    res.status(200).json({
      message: "Thành công"
    })
  }

  getChat = async (req, res) => {
    const { id } = req.query

    const message = await Message.findOne({ id }).exec()
    const user = await User.findOne({ username: id }).exec()
    user.chat = {
      ...user.chat,
      unseenMsgs: 0
    }
    await user.save()
    res.status(200).json({
      message,
      user
    })
  }

  getAllUser = async (req, res) => {
    User.find()
      .sort({ "chat.lastMessage.time": -1 })
      .then((result) => {
        res.status(200).json({
          users: result
        })
      })
      .catch((err) => {
        res.status(400).json({
          message: "Thất bại",
          err: err.message
        })
      })
  }

  addChatUser = async (req, res) => {
    const check = await User.findOne({ username: req.body.name }).exec()
    if (check) {
      res.status(400).json({
        message: "Thất bại"
      })
    } else {
      const user = new User({
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
      user.save().then((resulst) => {
        res.status(200).json({
          message: "Thành công",
          resulst
        })
      })
    }
  }
}

module.exports = new userChatController()
