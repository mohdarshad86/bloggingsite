const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
      match: /^[a-zA-Z ]{2,30}$/,
    },

    lname: {
      type: String,
      required: true,
      trim: true,
      match: /^[a-zA-Z ]{2,30}$/,
    },

    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
      required: true,
    },

    email: {
      type: String,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, //unique wont work here
      //so i have written the case in Customercontroller
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("author", authorSchema);
