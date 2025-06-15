import shorturl from "../models/shortUrl.model.js";

export const saveShortUrl = async (short_url, full_url, userId) => {  const newUrl = new shorturl({
    full_url,
    short_url,
  });

  if (userId) {
    newUrl.user = userId;
  }

  await newUrl.save();
};
