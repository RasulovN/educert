const { Schema, model } = require("mongoose");

const schduleSchema = new Schema(
  {
    filial: {
      type: Schema.Types.ObjectId,
      ref: "Filial",
      required: true,
      default: null,
    },
    time: {
      type: Schema.Types.ObjectId,
      ref: "Time",
      default: null,
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Schdule", schduleSchema);