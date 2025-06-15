import mongoose from "mongoose";

const messsageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    sender: {
      type: String,
      trim: true,
      enum: ["user", "assistant"],
    },
    message: {
      type: String,
      trim: true,
    },
    data: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messsageSchema);
