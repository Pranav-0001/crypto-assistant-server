import messageModel from "../model/messageModel.js";

export default async function saveAssistantMessage(message, chat, data) {
  try {
    const savedMessage = await new messageModel({
      chat: chat,
      data: data,
      role: "assistant",
      message: message,
      sender: "assistant",
    }).save();

    return savedMessage;
  } catch (err) {
    console.log(err?.message);
    return err?.message;
  }
}
