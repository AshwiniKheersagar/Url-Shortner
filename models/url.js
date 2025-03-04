const mongoose = require("mongoose");
const urlSchema =new mongoose.Schema(
  {
    shortId: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Url", urlSchema);
