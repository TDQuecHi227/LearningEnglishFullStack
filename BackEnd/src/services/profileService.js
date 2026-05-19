const User = require("../models/User");

const profileFields = ["fullName", "avatarUrl", "bio", "phoneNumber"];

const normalizeProfilePayload = (payload) => {
  return profileFields.reduce((accumulator, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      const value = payload[field];
      accumulator[field] = typeof value === "string" ? value.trim() : value;
    }

    return accumulator;
  }, {});
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "username email role profile createdAt updatedAt",
  );

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

const updateUserProfile = async (userId, payload) => {
  const profileData = normalizeProfilePayload(payload);

  if (Object.keys(profileData).length === 0) {
    throw new Error("NO_PROFILE_DATA");
  }

  // Chuyển đổi sang dot notation để tránh ghi đè toàn bộ object profile
  const updatePayload = {};
  for (const key in profileData) {
    updatePayload[`profile.${key}`] = profileData[key];
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updatePayload },
    { returnDocument: "after", runValidators: true },
  ).select("username email role profile createdAt updatedAt");

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
