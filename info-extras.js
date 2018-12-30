const url = require("url");

const Entities = require("html-entities").AllHtmlEntities;
const querystring = require("query-string");
import {
  between,
  stripHTML,
  parallel,
  addFormatMeta,
  sortFormats
} from "./util";

const VIDEO_URL = "https://www.youtube.com/watch?v=";
export const getMetaItem = (body, name) => {
  return between(body, `<meta itemprop="${name}" content="`, '">');
};

export const getVideoDescription = html => {
  const regex = /<p.*?id="eow-description".*?>(.+?)<\/p>[\n\r\s]*?<\/div>/im;
  const description = html.match(regex);
  return description ? Entities.decode(stripHTML(description[1])) : "";
};
export const getVideoMedia = body => {
  let mediainfo = between(
    body,
    '<div id="watch-description-extras">',
    '<div id="watch-discussion" class="branded-page-box yt-card">'
  );
  if (mediainfo === "") {
    return {};
  }

  const regexp = /<h4 class="title">([\s\S]*?)<\/h4>[\s\S]*?<ul .*?class=".*?watch-info-tag-list">[\s\S]*?<li>([\s\S]*?)<\/li>(?:\s*?<li>([\s\S]*?)<\/li>)?/g;
  const contentRegexp = /(?: - (\d{4}) \()?<a .*?(?:href="([^"]+)")?.*?>(.*?)<\/a>/;
  const imgRegexp = /<img src="([^"]+)".*?>/;
  const media = {};

  const image = imgRegexp.exec(mediainfo);
  if (image) {
    media.image = url.resolve(VIDEO_URL, image[1]);
  }

  let match;
  while ((match = regexp.exec(mediainfo)) != null) {
    let [, key, value, detail] = match;
    key = Entities.decode(key)
      .trim()
      .replace(/\s/g, "_")
      .toLowerCase();
    const content = contentRegexp.exec(value);
    if (content) {
      let [, year, mediaUrl, value2] = content;
      if (year) {
        media.year = parseInt(year);
      } else if (detail) {
        media.year = parseInt(detail);
      }
      value = value.slice(0, content.index);
      if (key !== "game" || value2 !== "YouTube Gaming") {
        value += value2;
      }
      media[key + "_url"] = "";
    }
    media[key] = Entities.decode(value);
  }
  return media;
};

const userRegexp = /<a href="\/user\/([^"]+)/;
const verifiedRegexp = /<span .*?(aria-label="Verified")(.*?(?=<\/span>))/;
export const getAuthor = body => {
  let ownerinfo = between(
    body,
    '<div id="watch7-user-header" class=" spf-link ">',
    '<div id="watch8-action-buttons" class="watch-action-buttons clearfix">'
  );
  if (ownerinfo === "") {
    return {};
  }
  const channelName = Entities.decode(
    between(
      between(ownerinfo, '<div class="yt-user-info">', "</div>"),
      ">",
      "</a>"
    )
  );
  const userMatch = ownerinfo.match(userRegexp);
  const verifiedMatch = ownerinfo.match(verifiedRegexp);
  const channelID = getMetaItem(body, "channelId");
  const username = userMatch
    ? userMatch[1]
    : between(
        between(body, '<span itemprop="author"', "</span>"),
        "/user/",
        '">'
      );
  return {
    id: channelID,
    name: channelName,
    avatar: "",
    verified: !!verifiedMatch,
    user: username,
    channel_url: "https://www.youtube.com/channel/" + channelID,
    user_url: "https://www.youtube.com/user/" + username
  };
};

export const getPublished = body => {
  return Date.parse(getMetaItem(body, "datePublished"));
};
export const getRelatedVideos = body => {
  let jsonStr = between(body, "'RELATED_PLAYER_ARGS': {\"rvs\":", "},");
  try {
    jsonStr = JSON.parse(jsonStr);
  } catch (err) {
    return [];
  }
  return jsonStr.split(",").map(link => encodeURI(link));
};
