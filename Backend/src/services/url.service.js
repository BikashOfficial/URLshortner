import { saveShortUrl } from "../dao/short_url.js";
import shorturl from "../models/shortUrl.model.js";
import { generateNanoId } from "../utils/helper.js";

export const createShortUrlServiceWithOutUser = async (url) => {
  const shortUrl = generateNanoId(7);
  if (!shortUrl) {
   throw new Error("Short Url not generated") 
  }
  await saveShortUrl(shortUrl, url);
  return shortUrl;
};
export const createShortUrlServiceWithUser = async (url) => {
  const shortUrl = generateNanoId(7);
  await saveShortUrl(shortUrl, url);
  return shortUrl;
};

export const getShortUrl = async (shortUrl) => {
  return await shorturl.findOneAndUpdate(
    { short_url: shortUrl },
    { $inc: { clicks: 1 } }
  );
};
