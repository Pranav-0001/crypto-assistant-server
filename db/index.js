import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://careercraft666:M4VDuKRMHXvTtpJ6@cluster0.6alsahk.mongodb.net/crypto?retryWrites=true&w=majority`
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
