
const querystring = require("query-string");

import FORMATS from "./formats";


const timeRegexp = /(?:(\d+)h)?(?:(\d+)m(?!s))?(?:(\d+)s)?(?:(\d+)(?:ms)?)?/;
export const parseTime = (time) => {
  const result = timeRegexp.exec(time.toString());
  const hours  = result[1] || 0;
  const mins   = result[2] || 0;
  const secs   = result[3] || 0;
  const ms     = result[4] || 0;

  return hours * 3600000 + mins * 60000 + secs * 1000 + parseInt(ms, 10);
};




// Use these to help sort formats, higher is better.
const audioEncodingRanks = {
    mp3: 1,
    vorbis: 2,
    aac: 3,
    opus: 4,
    flac: 5,
  };
  const videoEncodingRanks = {
    'Sorenson H.283': 1,
    'MPEG-4 Visual': 2,
    'VP8': 3,
    'VP9': 4,
    'H.264': 5,
  };

  


  export const   sortFormats = (a, b) => {
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
  export const  filterFormats = (formats, filter) => {
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



  export const  indexOf = (haystack, needle) => {
    return needle instanceof RegExp
      ? haystack.search(needle)
      : haystack.indexOf(needle);
  };
  
  export const  between = (haystack, left, right) => {
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


  export const  parseFormats = info => {
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
  
  export const addFormatMeta = format => {
    const meta = FORMATS[format.itag];
    for (let key in meta) {
      format[key] = meta[key];
    }
  
    format.live = /\/source\/yt_live_broadcast\//.test(format.url);
    format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
    format.isDashMPD = /\/manifest\/dash\//.test(format.url);
  };

  export const stripHTML = html => {
    return html
      .replace(/\n/g, " ")
      .replace(/\s*<\s*br\s*\/?\s*>\s*/gi, "\n")
      .replace(/<\s*\/\s*p\s*>\s*<\s*p[^>]*>/gi, "\n")
      .replace(/<.*?>/gi, "")
      .trim();
  };




  export const parallel = (funcs, callback) => {
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