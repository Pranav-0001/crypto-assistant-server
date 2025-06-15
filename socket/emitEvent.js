import { emitMessage } from "./socket.js";

export default async function emitEvent({ roomId, type, payload }) {
  try {
    await emitMessage({
      roomId: roomId,
      type: type,
      payload: payload,
    });

    return;
  } catch (err) {
    console.log("Error in emitEvent", err.message);
  }
}
