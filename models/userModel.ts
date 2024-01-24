import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minLength: 1,
      maxLength: 20,
    },
    DOB: {
      type: Date,
      required: true,
    },
    gender: {
      type: Boolean, // man- true, woman-false
      default: true,
      required: true,
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
      type: Number, //10-admin, 20-member
      required: true,
    },
    image: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

//delete old model
if (mongoose.models.users) {
  const userModel = mongoose.model("users");
  mongoose.deleteModel(userModel.modelName);
}
//create new model
const User = mongoose.model("users", userSchema);

export default User;
