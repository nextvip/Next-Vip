import mongoose from "mongoose";

const videoFolderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoFolder",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

videoFolderSchema.index({ user_id: 1, parent_id: 1 });

const VideoFolder = mongoose.model("VideoFolder", videoFolderSchema);

export default VideoFolder;
