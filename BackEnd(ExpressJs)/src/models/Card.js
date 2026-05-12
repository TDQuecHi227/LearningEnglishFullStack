const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    setId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashcardSet",
      required: true,
    },

    // Mặt trước: từ/câu cần học
    term: {
      type: String,
      required: true,
      trim: true,
    },

    // Phát âm, ví dụ: "/ɪmˈpreg.nə.bl/"
    pronunciation: {
      type: String,
      default: "",
    },

    // Loại từ: noun, verb, adjective, ...
    partOfSpeech: {
      type: String,
      default: "",
    },

    // Mặt sau: định nghĩa
    definition: {
      type: String,
      required: true,
      trim: true,
    },

    // Nghĩa tiếng Việt (nếu có)
    definitionVi: {
      type: String,
      default: "",
    },

    // Câu ví dụ
    exampleSentence: {
      type: String,
      default: "",
    },

    // Ảnh minh họa hiển thị khi lật card
    imageUrl: {
      type: String,
      default: "",
    },

    // File audio phát âm
    audioUrl: {
      type: String,
      default: "",
    },

    // Thứ tự trong bộ
    orderIndex: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

cardSchema.index({ setId: 1, orderIndex: 1 });
cardSchema.index({ setId: 1, isActive: 1 });

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
