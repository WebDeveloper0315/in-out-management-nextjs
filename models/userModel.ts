import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    DOB: {
      type: Date,
      required: false,
    },
    gender: {
      type: Boolean, // man- true, woman-false
      default: true,
      required: false,
    },
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String, 
      required: true,
    },
    image: {
      type: String,
      default: "Avatars/user_man.png",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

// Model creation
const User = mongoose.models.users || mongoose.model("users", userSchema);


export default User;
