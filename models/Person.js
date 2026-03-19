const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  details: {
    type: String,
    default: ""
  },

  gender: {
    type: String,
    enum: ["male", "female"],
    required: true
  },

  profileImage: {
    type: String
  },

  married: {
    type: Boolean,
    default: false
  },

  spouse: {
    type: String,
    default: ""
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    default: null
  },

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person"
    }
  ]
},
{ timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);