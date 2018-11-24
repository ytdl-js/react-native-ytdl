const Entities = require("html-entities").AllHtmlEntities;
const querystring = require("query-string");

/**
 * http://en.wikipedia.org/wiki/YouTube#Quality_and_formats
 */
FORMATS = {
  "5": {
    container: "flv",
    resolution: "240p",
    encoding: "Sorenson H.283",
    profile: null,
    bitrate: "0.25",
    audioEncoding: "mp3",
    audioBitrate: 64
  },

  "6": {
    container: "flv",
    resolution: "270p",
    encoding: "Sorenson H.263",
    profile: null,
    bitrate: "0.8",
    audioEncoding: "mp3",
    audioBitrate: 64
  },

  "13": {
    container: "3gp",
    resolution: null,
    encoding: "MPEG-4 Visual",
    profile: null,
    bitrate: "0.5",
    audioEncoding: "aac",
    audioBitrate: null
  },

  "17": {
    container: "3gp",
    resolution: "144p",
    encoding: "MPEG-4 Visual",
    profile: "simple",
    bitrate: "0.05",
    audioEncoding: "aac",
    audioBitrate: 24
  },

  "18": {
    container: "mp4",
    resolution: "360p",
    encoding: "H.264",
    profile: "baseline",
    bitrate: "0.5",
    audioEncoding: "aac",
    audioBitrate: 96
  },

  "22": {
    container: "mp4",
    resolution: "720p",
    encoding: "H.264",
    profile: "high",
    bitrate: "2-3",
    audioEncoding: "aac",
    audioBitrate: 192
  },

  "34": {
    container: "flv",
    resolution: "360p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.5",
    audioEncoding: "aac",
    audioBitrate: 128
  },

  "35": {
    container: "flv",
    resolution: "480p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.8-1",
    audioEncoding: "aac",
    audioBitrate: 128
  },

  "36": {
    container: "3gp",
    resolution: "240p",
    encoding: "MPEG-4 Visual",
    profile: "simple",
    bitrate: "0.175",
    audioEncoding: "aac",
    audioBitrate: 32
  },

  "37": {
    container: "mp4",
    resolution: "1080p",
    encoding: "H.264",
    profile: "high",
    bitrate: "3-5.9",
    audioEncoding: "aac",
    audioBitrate: 192
  },

  "38": {
    container: "mp4",
    resolution: "3072p",
    encoding: "H.264",
    profile: "high",
    bitrate: "3.5-5",
    audioEncoding: "aac",
    audioBitrate: 192
  },

  "43": {
    container: "webm",
    resolution: "360p",
    encoding: "VP8",
    profile: null,
    bitrate: "0.5-0.75",
    audioEncoding: "vorbis",
    audioBitrate: 128
  },

  "44": {
    container: "webm",
    resolution: "480p",
    encoding: "VP8",
    profile: null,
    bitrate: "1",
    audioEncoding: "vorbis",
    audioBitrate: 128
  },

  "45": {
    container: "webm",
    resolution: "720p",
    encoding: "VP8",
    profile: null,
    bitrate: "2",
    audioEncoding: "vorbis",
    audioBitrate: 192
  },

  "46": {
    container: "webm",
    resolution: "1080p",
    encoding: "vp8",
    profile: null,
    bitrate: null,
    audioEncoding: "vorbis",
    audioBitrate: 192
  },

  "82": {
    container: "mp4",
    resolution: "360p",
    encoding: "H.264",
    profile: "3d",
    bitrate: "0.5",
    audioEncoding: "aac",
    audioBitrate: 96
  },

  "83": {
    container: "mp4",
    resolution: "240p",
    encoding: "H.264",
    profile: "3d",
    bitrate: "0.5",
    audioEncoding: "aac",
    audioBitrate: 96
  },

  "84": {
    container: "mp4",
    resolution: "720p",
    encoding: "H.264",
    profile: "3d",
    bitrate: "2-3",
    audioEncoding: "aac",
    audioBitrate: 192
  },

  "85": {
    container: "mp4",
    resolution: "1080p",
    encoding: "H.264",
    profile: "3d",
    bitrate: "3-4",
    audioEncoding: "aac",
    audioBitrate: 192
  },

  "100": {
    container: "webm",
    resolution: "360p",
    encoding: "VP8",
    profile: "3d",
    bitrate: null,
    audioEncoding: "vorbis",
    audioBitrate: 128
  },

  "101": {
    container: "webm",
    resolution: "360p",
    encoding: "VP8",
    profile: "3d",
    bitrate: null,
    audioEncoding: "vorbis",
    audioBitrate: 192
  },

  "102": {
    container: "webm",
    resolution: "720p",
    encoding: "VP8",
    profile: "3d",
    bitrate: null,
    audioEncoding: "vorbis",
    audioBitrate: 192
  },

  // DASH (video only)
  "133": {
    container: "mp4",
    resolution: "240p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.2-0.3",
    audioEncoding: null,
    audioBitrate: null
  },

  "134": {
    container: "mp4",
    resolution: "360p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.3-0.4",
    audioEncoding: null,
    audioBitrate: null
  },

  "135": {
    container: "mp4",
    resolution: "480p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.5-1",
    audioEncoding: null,
    audioBitrate: null
  },

  "136": {
    container: "mp4",
    resolution: "720p",
    encoding: "H.264",
    profile: "main",
    bitrate: "1-1.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "137": {
    container: "mp4",
    resolution: "1080p",
    encoding: "H.264",
    profile: "high",
    bitrate: "2.5-3",
    audioEncoding: null,
    audioBitrate: null
  },

  "138": {
    container: "mp4",
    resolution: "4320p",
    encoding: "H.264",
    profile: "high",
    bitrate: "13.5-25",
    audioEncoding: null,
    audioBitrate: null
  },

  "160": {
    container: "mp4",
    resolution: "144p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.1",
    audioEncoding: null,
    audioBitrate: null
  },

  "242": {
    container: "webm",
    resolution: "240p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "0.1-0.2",
    audioEncoding: null,
    audioBitrate: null
  },

  "243": {
    container: "webm",
    resolution: "360p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "0.25",
    audioEncoding: null,
    audioBitrate: null
  },

  "244": {
    container: "webm",
    resolution: "480p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "0.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "247": {
    container: "webm",
    resolution: "720p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "0.7-0.8",
    audioEncoding: null,
    audioBitrate: null
  },

  "248": {
    container: "webm",
    resolution: "1080p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "1.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "264": {
    container: "mp4",
    resolution: "1440p",
    encoding: "H.264",
    profile: "high",
    bitrate: "4-4.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "266": {
    container: "mp4",
    resolution: "2160p",
    encoding: "H.264",
    profile: "high",
    bitrate: "12.5-16",
    audioEncoding: null,
    audioBitrate: null
  },

  "271": {
    container: "webm",
    resolution: "1440p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "9",
    audioEncoding: null,
    audioBitrate: null
  },

  "272": {
    container: "webm",
    resolution: "4320p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "20-25",
    audioEncoding: null,
    audioBitrate: null
  },

  "278": {
    container: "webm",
    resolution: "144p 15fps",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "0.08",
    audioEncoding: null,
    audioBitrate: null
  },

  "298": {
    container: "mp4",
    resolution: "720p",
    encoding: "H.264",
    profile: "main",
    bitrate: "3-3.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "299": {
    container: "mp4",
    resolution: "1080p",
    encoding: "H.264",
    profile: "high",
    bitrate: "5.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "302": {
    container: "webm",
    resolution: "720p HFR",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "2.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "303": {
    container: "webm",
    resolution: "1080p HFR",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "5",
    audioEncoding: null,
    audioBitrate: null
  },

  "308": {
    container: "webm",
    resolution: "1440p HFR",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "10",
    audioEncoding: null,
    audioBitrate: null
  },

  "313": {
    container: "webm",
    resolution: "2160p",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "13-15",
    audioEncoding: null,
    audioBitrate: null
  },

  "315": {
    container: "webm",
    resolution: "2160p HFR",
    encoding: "VP9",
    profile: "profile 0",
    bitrate: "20-25",
    audioEncoding: null,
    audioBitrate: null
  },

  "330": {
    container: "webm",
    resolution: "144p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "0.08",
    audioEncoding: null,
    audioBitrate: null
  },

  "331": {
    container: "webm",
    resolution: "240p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "0.1-0.15",
    audioEncoding: null,
    audioBitrate: null
  },

  "332": {
    container: "webm",
    resolution: "360p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "0.25",
    audioEncoding: null,
    audioBitrate: null
  },

  "333": {
    container: "webm",
    resolution: "240p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "0.5",
    audioEncoding: null,
    audioBitrate: null
  },

  "334": {
    container: "webm",
    resolution: "720p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "1",
    audioEncoding: null,
    audioBitrate: null
  },

  "335": {
    container: "webm",
    resolution: "1080p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "1.5-2",
    audioEncoding: null,
    audioBitrate: null
  },

  "336": {
    container: "webm",
    resolution: "1440p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "5-7",
    audioEncoding: null,
    audioBitrate: null
  },

  "337": {
    container: "webm",
    resolution: "2160p HDR, HFR",
    encoding: "VP9",
    profile: "profile 2",
    bitrate: "12-14",
    audioEncoding: null,
    audioBitrate: null
  },

  // DASH (audio only)
  "139": {
    container: "mp4",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "aac",
    audioBitrate: 48
  },

  "140": {
    container: "m4a",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "aac",
    audioBitrate: 128
  },

  "141": {
    container: "mp4",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "aac",
    audioBitrate: 256
  },

  "171": {
    container: "webm",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "vorbis",
    audioBitrate: 128
  },

  "172": {
    container: "webm",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "vorbis",
    audioBitrate: 192
  },

  "249": {
    container: "webm",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "opus",
    audioBitrate: 48
  },
  "250": {
    container: "webm",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "opus",
    audioBitrate: 64
  },
  "251": {
    container: "webm",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "opus",
    audioBitrate: 160
  },

  // Live streaming
  "91": {
    container: "ts",
    resolution: "144p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.1",
    audioEncoding: "aac",
    audioBitrate: 48
  },

  "92": {
    container: "ts",
    resolution: "240p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.15-0.3",
    audioEncoding: "aac",
    audioBitrate: 48
  },

  "93": {
    container: "ts",
    resolution: "360p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.5-1",
    audioEncoding: "aac",
    audioBitrate: 128
  },

  "94": {
    container: "ts",
    resolution: "480p",
    encoding: "H.264",
    profile: "main",
    bitrate: "0.8-1.25",
    audioEncoding: "aac",
    audioBitrate: 128
  },

  "95": {
    container: "ts",
    resolution: "720p",
    encoding: "H.264",
    profile: "main",
    bitrate: "1.5-3",
    audioEncoding: "aac",
    audioBitrate: 256
  },

  "96": {
    container: "ts",
    resolution: "1080p",
    encoding: "H.264",
    profile: "high",
    bitrate: "2.5-6",
    audioEncoding: "aac",
    audioBitrate: 256
  },

  "120": {
    container: "flv",
    resolution: "720p",
    encoding: "H.264",
    profile: "Main@L3.1",
    bitrate: "2",
    audioEncoding: "aac",
    audioBitrate: 128
  },

  "127": {
    container: "ts",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "aac",
    audioBitrate: 96
  },

  "128": {
    container: "ts",
    resolution: null,
    encoding: null,
    profile: null,
    bitrate: null,
    audioEncoding: "aac",
    audioBitrate: 96
  },

  "132": {
    container: "ts",
    resolution: "240p",
    encoding: "H.264",
    profile: "baseline",
    bitrate: "0.15-0.2",
    audioEncoding: "aac",
    audioBitrate: 48
  },

  "151": {
    container: "ts",
    resolution: "720p",
    encoding: "H.264",
    profile: "baseline",
    bitrate: "0.05",
    audioEncoding: "aac",
    audioBitrate: 24
  }
};

const VIDEO_URL = "https://www.youtube.com/watch?v=";
const EMBED_URL = "https://www.youtube.com/embed/";
const VIDEO_EURL = "https://youtube.googleapis.com/v/";
const INFO_HOST = "www.youtube.com";
const INFO_PATH = "/get_video_info";
const KEYS_TO_SPLIT = ["keywords", "fmt_list", "fexp", "watermark"];

const jsVarStr = "[a-zA-Z_\\$][a-zA-Z_0-9]*";
const jsSingleQuoteStr = `'[^'\\\\]*(:?\\\\[\\s\\S][^'\\\\]*)*'`;
const jsDoubleQuoteStr = `"[^"\\\\]*(:?\\\\[\\s\\S][^"\\\\]*)*"`;
const jsQuoteStr = `(?:${jsSingleQuoteStr}|${jsDoubleQuoteStr})`;
const jsKeyStr = `(?:${jsVarStr}|${jsQuoteStr})`;
const jsPropStr = `(?:\\.${jsVarStr}|\\[${jsQuoteStr}\\])`;
const jsEmptyStr = `(?:''|"")`;
const reverseStr =
  ":function\\(a\\)\\{" + "(?:return )?a\\.reverse\\(\\)" + "\\}";
const sliceStr = ":function\\(a,b\\)\\{" + "return a\\.slice\\(b\\)" + "\\}";
const spliceStr = ":function\\(a,b\\)\\{" + "a\\.splice\\(0,b\\)" + "\\}";
const swapStr =
  ":function\\(a,b\\)\\{" +
  "var c=a\\[0\\];a\\[0\\]=a\\[b(?:%a\\.length)?\\];a\\[b(?:%a\\.length)?\\]=c(?:;return a)?" +
  "\\}";
const actionsObjRegexp = new RegExp(
  `var (${jsVarStr})=\\{((?:(?:` +
    jsKeyStr +
    reverseStr +
    "|" +
    jsKeyStr +
    sliceStr +
    "|" +
    jsKeyStr +
    spliceStr +
    "|" +
    jsKeyStr +
    swapStr +
    "),?\\r?\\n?)+)\\};"
);
const actionsFuncRegexp = new RegExp(
  `function(?: ${jsVarStr})?\\(a\\)\\{` +
    `a=a\\.split\\(${jsEmptyStr}\\);\\s*` +
    `((?:(?:a=)?${jsVarStr}` +
    jsPropStr +
    "\\(a,\\d+\\);)+)" +
    `return a\\.join\\(${jsEmptyStr}\\)` +
    "\\}"
);
const reverseRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${reverseStr}`, "m");
const sliceRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${sliceStr}`, "m");
const spliceRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${spliceStr}`, "m");
const swapRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${swapStr}`, "m");

// Use these to help sort formats, higher is better.
const audioEncodingRanks = {
  mp3: 1,
  vorbis: 2,
  aac: 3,
  opus: 4,
  flac: 5
};
const videoEncodingRanks = {
  "Sorenson H.283": 1,
  "MPEG-4 Visual": 2,
  VP8: 3,
  VP9: 4,
  "H.264": 5
};

const indexOf = (haystack, needle) => {
  return needle instanceof RegExp
    ? haystack.search(needle)
    : haystack.indexOf(needle);
};

between = (haystack, left, right) => {
  let pos = indexOf(haystack, left);
  if (pos === -1) {
    return "";
  }
  haystack = haystack.slice(pos + left.length);
  pos = indexOf(haystack, right);
  if (pos === -1) {
    return "";
  }
  haystack = haystack.slice(0, pos);
  return haystack;
};

this.stripHTML = html => {
  return html
    .replace(/\n/g, " ")
    .replace(/\s*<\s*br\s*\/?\s*>\s*/gi, "\n")
    .replace(/<\s*\/\s*p\s*>\s*<\s*p[^>]*>/gi, "\n")
    .replace(/<.*?>/gi, "")
    .trim();
};

const getMetaItem = (body, name) => {
  return this.between(body, `<meta itemprop="${name}" content="`, '">');
};
getVideoDescription = html => {
  const regex = /<p.*?id="eow-description".*?>(.+?)<\/p>[\n\r\s]*?<\/div>/im;
  const description = html.match(regex);
  return description ? Entities.decode(this.stripHTML(description[1])) : "";
};
getVideoMedia = body => {
  let mediainfo = this.between(
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
getRelatedVideos = body => {
  let jsonStr = this.between(body, "'RELATED_PLAYER_ARGS': {\"rvs\":", "},");
  try {
    jsonStr = JSON.parse(jsonStr);
  } catch (err) {
    return [];
  }
  return jsonStr.split(",").map(link => encodeURI(link));
};

const userRegexp = /<a href="\/user\/([^"]+)/;
const verifiedRegexp = /<span .*?(aria-label="Verified")(.*?(?=<\/span>))/;
this.getAuthor = body => {
  let ownerinfo = this.between(
    body,
    '<div id="watch7-user-header" class=" spf-link ">',
    '<div id="watch8-action-buttons" class="watch-action-buttons clearfix">'
  );
  if (ownerinfo === "") {
    return {};
  }
  const channelName = Entities.decode(
    this.between(
      this.between(ownerinfo, '<div class="yt-user-info">', "</div>"),
      ">",
      "</a>"
    )
  );
  const userMatch = ownerinfo.match(userRegexp);
  const verifiedMatch = ownerinfo.match(verifiedRegexp);
  const channelID = getMetaItem(body, "channelId");
  const username = userMatch
    ? userMatch[1]
    : this.between(
        this.between(body, '<span itemprop="author"', "</span>"),
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

parseFormats = info => {
  let formats = [];
  if (info.url_encoded_fmt_stream_map) {
    formats = formats.concat(info.url_encoded_fmt_stream_map.split(","));
  }
  if (info.adaptive_fmts) {
    formats = formats.concat(info.adaptive_fmts.split(","));
  }

  formats = formats.map(format => querystring.parse(format));
  delete info.url_encoded_fmt_stream_map;
  delete info.adaptive_fmts;

  return formats;
};

getPublished = body => {
  return Date.parse(getMetaItem(body, "datePublished"));
};

const gotConfig = (id, options, additional, config, fromEmbed, callback) => {
  if (!config) {
    return callback(Error("Could not find player config"));
  }
  try {
    config = JSON.parse(config + (fromEmbed ? "}" : ""));
  } catch (err) {
    return callback(Error("Error parsing config: " + err.message));
  }

  fetch(
    "https://" +
      INFO_HOST +
      INFO_PATH +
      "?" +
      querystring.stringify({
        video_id: id,
        eurl: VIDEO_EURL + id,
        ps: "default",
        gl: "US",
        hl: "en",
        sts: config.sts
      })
  )
    .then(body => body.text())
    .then(body => {
      // console.log("Got response: "+body.length )

      let info = querystring.parse(body);
      // console.log('info: ' + JSON.stringify(info)  )

      if (info.status === "fail") {
        if (
          config.args &&
          (config.args.fmt_list ||
            config.args.url_encoded_fmt_stream_map ||
            config.args.adaptive_fmts)
        ) {
          info = config.args;
          info.no_embed_allowed = true;
        } else {
          return callback(
            Error(`Code ${info.errorcode}: ${this.stripHTML(info.reason)}`)
          );
        }
      }

      const player_response =
        config.args.player_response || info.player_response;
      if (player_response) {
        try {
          info.player_response = JSON.parse(player_response);
        } catch (err) {
          return callback(
            Error("Error parsing `player_response`: " + err.message)
          );
        }
        let playability = info.player_response.playabilityStatus;
        if (playability && playability.status === "UNPLAYABLE") {
          return callback(Error(playability.reason));
        }
      }

      // Split some keys by commas.
      KEYS_TO_SPLIT.forEach(key => {
        if (!info[key]) return;
        info[key] = info[key].split(",").filter(v => v !== "");
      });

      info.fmt_list = info.fmt_list
        ? info.fmt_list.map(format => format.split("/"))
        : [];

      info.formats = this.parseFormats(info);

      // Add additional properties to info.
      Object.assign(info, additional);
      info.age_restricted = fromEmbed;
      info.html5player = config.assets.js;
      if (config.args.dashmpd && info.dashmpd !== config.args.dashmpd) {
        info.dashmpd2 = config.args.dashmpd;
      }

      callback(null, info);
    })
    .catch(err => console.error(err));
};

/**
 * Gets info from a video without getting additional formats.
 *
 * @param {string} id
 * @param {Object} options
 * @param {Function(Error, Object)} callback
 */
getBasicInfo = (id, options, callback) => {
  // Try getting config from the video page first.
  const params = "hl=" + (options.lang || "en");
  let url =
    VIDEO_URL + id + "&" + params + "&bpctr=" + Math.ceil(Date.now() / 1000);

  // Remove header from watch page request.
  // Otherwise, it'll use a different framework for rendering content.
  const reqOptions = Object.assign({}, options.requestOptions);
  reqOptions.headers = Object.assign({}, reqOptions.headers, {
    "User-Agent": ""
  });

  fetch(url)
    .then(body => body.text())
    .then(body => {
      console.log("body: " + body.length);

      err = null;
      res = null;

      // Check if there are any errors with this video page.
      const unavailableMsg = this.between(
        body,
        '<div id="player-unavailable"',
        ">"
      );
      if (
        unavailableMsg &&
        !/\bhid\b/.test(this.between(unavailableMsg, 'class="', '"'))
      ) {
        // Ignore error about age restriction.
        if (!body.includes('<div id="watch7-player-age-gate-content"')) {
          return callback(
            Error(
              this.between(
                body,
                '<h1 id="unavailable-message" class="message">',
                "</h1>"
              ).trim()
            )
          );
        }
      }

      // Parse out additional metadata from this page.
      const additional = {
        // Get the author/uploader.
        author: this.getAuthor(body),

        // Get the day the vid was published.
        published: this.getPublished(body),

        // Get description.
        description: this.getVideoDescription(body),

        // Get media info.
        media: this.getVideoMedia(body),

        // Get related videos.
        related_videos: this.getRelatedVideos(body),

        // Give the standard link to the video.
        video_url: VIDEO_URL + id
      };

      const jsonStr = this.between(body, "ytplayer.config = ", "</script>");
      let config;
      if (jsonStr) {
        config = jsonStr.slice(0, jsonStr.lastIndexOf(";ytplayer.load"));
        gotConfig(id, options, additional, config, false, callback);
      } else {
        // If the video page doesn't work, maybe because it has mature content.
        // and requires an account logged in to view, try the embed page.
        url = EMBED_URL + id + "?" + params;

        fetch(url)
          .then(body => body.text())
          .then(body => {
            if (err) return callback(err);
            config = this.between(
              body,
              "t.setConfig({'PLAYER_CONFIG': ",
              /\}(,'|\}\);)/
            );
            gotConfig(id, options, additional, config, true, callback);
          })
          .catch(err => console.error(err));
      }
    })
    .catch(error => console.error(error));
};

extractActions = body => {
  const objResult = actionsObjRegexp.exec(body);
  const funcResult = actionsFuncRegexp.exec(body);
  if (!objResult || !funcResult) {
    return null;
  }

  const obj = objResult[1].replace(/\$/g, "\\$");
  const objBody = objResult[2].replace(/\$/g, "\\$");
  const funcBody = funcResult[1].replace(/\$/g, "\\$");

  let result = reverseRegexp.exec(objBody);
  const reverseKey =
    result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");
  result = sliceRegexp.exec(objBody);
  const sliceKey =
    result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");
  result = spliceRegexp.exec(objBody);
  const spliceKey =
    result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");
  result = swapRegexp.exec(objBody);
  const swapKey =
    result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");

  const keys = `(${[reverseKey, sliceKey, spliceKey, swapKey].join("|")})`;
  const myreg =
    "(?:a=)?" +
    obj +
    `(?:\\.${keys}|\\['${keys}'\\]|\\["${keys}"\\])` +
    "\\(a,(\\d+)\\)";
  const tokenizeRegexp = new RegExp(myreg, "g");
  const tokens = [];
  while ((result = tokenizeRegexp.exec(funcBody)) !== null) {
    let key = result[1] || result[2] || result[3];
    switch (key) {
      case swapKey:
        tokens.push("w" + result[4]);
        break;
      case reverseKey:
        tokens.push("r");
        break;
      case sliceKey:
        tokens.push("s" + result[4]);
        break;
      case spliceKey:
        tokens.push("p" + result[4]);
        break;
    }
  }
  return tokens;
};

this.cache = new Map();
getTokens = (html5playerfile, options, callback) => {
  let key, cachedTokens;
  const rs = /(?:html5)?player[-_]([a-zA-Z0-9\-_]+)(?:\.js|\/)/.exec(
    html5playerfile
  );
  if (rs) {
    key = rs[1];
    cachedTokens = this.cache.get(key);
  } else {
    console.warn("Could not extract html5player key:", html5playerfile);
  }
  if (cachedTokens) {
    callback(null, cachedTokens);
  } else {
    fetch(html5playerfile)
      .then(body => body.text())
      .then(body => {
        const tokens = this.extractActions(body);
        if (key && (!tokens || !tokens.length)) {
          callback(Error("Could not extract signature deciphering actions"));
          return;
        }

        this.cache.set(key, tokens);
        callback(null, tokens);
      })
      .catch(err => console.error(err));
  }
};

const swapHeadAndPosition = (arr, position) => {
  const first = arr[0];
  arr[0] = arr[position % arr.length];
  arr[position] = first;
  return arr;
};
decipher = (tokens, sig) => {
  sig = sig.split("");
  for (let i = 0, len = tokens.length; i < len; i++) {
    let token = tokens[i],
      pos;
    switch (token[0]) {
      case "r":
        sig = sig.reverse();
        break;
      case "w":
        pos = ~~token.slice(1);
        sig = swapHeadAndPosition(sig, pos);
        break;
      case "s":
        pos = ~~token.slice(1);
        sig = sig.slice(pos);
        break;
      case "p":
        pos = ~~token.slice(1);
        sig.splice(0, pos);
        break;
    }
  }
  return sig.join("");
};

updateQueryStringParameter=(uri, key, value) =>{
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}


setDownloadURL = (format, sig, debug) => {
  let decodedUrl;
  if (format.url) {
    decodedUrl = format.url;
  } else {
    if (debug) {
      console.warn("Download url not found for itag " + format.itag);
    }
    return;
  }

  try {
    decodedUrl = decodeURIComponent(decodedUrl);
  } catch (err) {
    if (debug) {
      console.warn("Could not decode url: " + err.message);
    }
    return;
  }

  // Make some adjustments to the final url.

  // Deleting the `search` part is necessary otherwise changes to
  // `query` won't reflect when running `url.format()`


  
  
  // This is needed for a speedier download.
  // See https://github.com/fent/node-ytdl-core/issues/127
  decodedUrl = updateQueryStringParameter(decodedUrl,'ratebypass','yes')

  if (sig) {
    decodedUrl = updateQueryStringParameter(decodedUrl,'signature',sig)

  }

  format.url = decodedUrl
  console.log("format.url: "+format.url)

};

decipherFormats = (formats, tokens, debug) => {
  formats.forEach(format => {
    const sig = tokens && format.s ? this.decipher(tokens, format.s) : null;
    this.setDownloadURL(format, sig, debug);
  });
};
parallel = (funcs, callback) => {
  let funcsDone = 0;
  let errGiven = false;
  let results = [];
  const len = funcs.length;

  const checkDone = (index, err, result) => {
    if (errGiven) {
      return;
    }
    if (err) {
      errGiven = true;
      callback(err);
      return;
    }
    results[index] = result;
    if (++funcsDone === len) {
      callback(null, results);
    }
  };

  if (len > 0) {
    funcs.forEach((f, i) => {
      f(checkDone.bind(null, i));
    });
  } else {
    callback(null, results);
  }
};

parseFormats = info => {
  let formats = [];
  if (info.url_encoded_fmt_stream_map) {
    formats = formats.concat(info.url_encoded_fmt_stream_map.split(","));
  }
  if (info.adaptive_fmts) {
    formats = formats.concat(info.adaptive_fmts.split(","));
  }

  formats = formats.map(format => querystring.parse(format));
  delete info.url_encoded_fmt_stream_map;
  delete info.adaptive_fmts;

  return formats;
};

addFormatMeta = format => {
  const meta = FORMATS[format.itag];
  for (let key in meta) {
    format[key] = meta[key];
  }

  format.live = /\/source\/yt_live_broadcast\//.test(format.url);
  format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
  format.isDashMPD = /\/manifest\/dash\//.test(format.url);
};
sortFormats = (a, b) => {
  const ares = a.resolution ? parseInt(a.resolution.slice(0, -1), 10) : 0;
  const bres = b.resolution ? parseInt(b.resolution.slice(0, -1), 10) : 0;
  const afeats = ~~!!ares * 2 + ~~!!a.audioBitrate;
  const bfeats = ~~!!bres * 2 + ~~!!b.audioBitrate;

  const getBitrate = c => {
    if (c.bitrate) {
      let s = c.bitrate.split("-");
      return parseFloat(s[s.length - 1], 10);
    } else {
      return 0;
    }
  };

  const audioScore = c => {
    const abitrate = c.audioBitrate || 0;
    const aenc = audioEncodingRanks[c.audioEncoding] || 0;
    return abitrate + aenc / 10;
  };

  if (afeats === bfeats) {
    if (ares === bres) {
      let avbitrate = getBitrate(a);
      let bvbitrate = getBitrate(b);
      if (avbitrate === bvbitrate) {
        let aascore = audioScore(a);
        let bascore = audioScore(b);
        if (aascore === bascore) {
          let avenc = videoEncodingRanks[a.encoding] || 0;
          let bvenc = videoEncodingRanks[b.encoding] || 0;
          return bvenc - avenc;
        } else {
          return bascore - aascore;
        }
      } else {
        return bvbitrate - avbitrate;
      }
    } else {
      return bres - ares;
    }
  } else {
    return bfeats - afeats;
  }
};
filterFormats = (formats, filter) => {
  let fn;
  switch (filter) {
    case "audioandvideo":
      fn = format => format.bitrate && format.audioBitrate;
      break;

    case "video":
      fn = format => format.bitrate;
      break;

    case "videoonly":
      fn = format => format.bitrate && !format.audioBitrate;
      break;

    case "audio":
      fn = format => format.audioBitrate;
      break;

    case "audioonly":
      fn = format => !format.bitrate && format.audioBitrate;
      break;

    default:
      if (typeof filter === "function") {
        fn = filter;
      } else {
        throw TypeError(`Given filter (${filter}) is not supported`);
      }
  }
  return formats.filter(fn);
};
getFullInfo = (id, options, callback) => {
  return this.getBasicInfo(id, options, (err, info) => {
    if (err) return callback(err);
 
    if (info.formats.length || info.dashmpd || info.dashmpd2 || info.hlsvp) {
      const html5playerfile = "https://" + INFO_HOST + info.html5player;
      // console.log("html5playerfile: "+html5playerfile)
      this.getTokens(html5playerfile, options, (err, tokens) => {
        if (err) return callback(err);

        // console.log("info.formats: "+JSON.stringify(info.formats))
        this.decipherFormats(info.formats, tokens, options.debug);
        // console.log("after info.formats: "+JSON.stringify(info.formats))

        let funcs = [];

        if (info.dashmpd) {
          info.dashmpd = decipherURL(info.dashmpd, tokens);
          funcs.push(getDashManifest.bind(null, info.dashmpd, options));
        }

        if (info.dashmpd2) {
          info.dashmpd2 = decipherURL(info.dashmpd2, tokens);
          funcs.push(getDashManifest.bind(null, info.dashmpd2, options));
        }

        if (info.hlsvp) {
          info.hlsvp = decipherURL(info.hlsvp, tokens);
          funcs.push(getM3U8.bind(null, info.hlsvp, options));
        }

        this.parallel(funcs, (err, results) => {
          if (err) return callback(err);
          if (results[0]) {
            mergeFormats(info, results[0]);
          }
          if (results[1]) {
            mergeFormats(info, results[1]);
          }
          if (results[2]) {
            mergeFormats(info, results[2]);
          }
          if (!info.formats.length) {
            callback(Error("No formats found"));
            return;
          }

          if (options.debug) {
            info.formats.forEach(format => {
              const itag = format.itag;
              if (!FORMATS[itag]) {
                console.warn(`No format metadata for itag ${itag} found`);
              }
            });
          }

          info.formats.forEach(this.addFormatMeta);
          info.formats.sort(this.sortFormats);
          info.full = true;
          callback(null, info);
        });
      });
    } else {
      callback(Error("This video is unavailable"));
    }
  });
};

// getBasicInfo("aYr4fDuLhXg",{},
//   (e,info)=>{
//     console.log("e "+e)
//     console.log("MOHALLA ")
//     console.log("info "+JSON.stringify(info))
//   }

// )

getFullInfo("aYr4fDuLhXg", {}, (e, info) => {
  // console.log("e "+e)
  // console.log("MAHALO ")
  // console.log("info " + info.formats[21].url);

  // let audioFormats = filterFormats(info.formats, 'audioonly');
  // console.log('Formats with only audio: ' + audioFormats.length);
  // console.log('Formats with only audio whole: ' + JSON.stringify(audioFormats[0].url));
});
