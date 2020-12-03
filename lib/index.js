const getInfo = require('./info');
const utils = require('./utils');
const formatUtils = require('./format-utils');
const urlUtils = require('./url-utils');
const sig = require('./sig');
const { parseTimestamp } = require("./__REACT_NATIVE_YTDL_CUSTOM_MODULES__/m3u8stream");

/**
 * @param {string} link
 * @param {!Object} options
 * @returns {Promise<Array.<Object>>}
 */
const ytdl = (link, options) => {
  return ytdl.getInfo(link, options).then(info => {
    return getURLsFromInfoCallback(info, options);
  });
};

ytdl.getBasicInfo = getInfo.getBasicInfo;
ytdl.getInfo = getInfo.getInfo;
ytdl.chooseFormat = formatUtils.chooseFormat;
ytdl.filterFormats = formatUtils.filterFormats;
ytdl.validateID = urlUtils.validateID;
ytdl.validateURL = urlUtils.validateURL;
ytdl.getURLVideoID = urlUtils.getURLVideoID;
ytdl.getVideoID = urlUtils.getVideoID;
ytdl.cache = {
  sig: sig.cache,
  info: getInfo.cache,
  cookie: getInfo.cookieCache,
};


/**
 * Gets downloadable URLs
 *
 * @param {Object} info
 * @param {Object} options
 * @returns {Promise<Array.<Object>>}
 */
const getURLsFromInfoCallback = (info, options) => new Promise(async (resolve, reject) => {
  options = options || {};

  let err = utils.playError(info.player_response, ['UNPLAYABLE', 'LIVE_STREAM_OFFLINE', 'LOGIN_REQUIRED']);
  if (err) {
    reject(err);
    return;
  }

  if (!info.formats.length) {
    reject(Error('This video is unavailable'));
    return;
  }

  let format;
  try {
    format = formatUtils.chooseFormat(info.formats, options);
  } catch (e) {
    reject(e);
    return;
  }

  const ret = [];
  if (!format.isHLS && !format.isDashMPD) {

    if (options.begin) {
      format.url += `&begin=${parseTimestamp(options.begin)}`;
    }

    const currentStream = {
      url: format.url,
      headers: []
    }
    if (options.range && (options.range.start || options.range.end)) {
      currentStream.headers.push({
        'Range': `bytes=${options.range.start || '0'}-${options.range.end || ''}`
      })
    }

    ret.push(currentStream);

  } else {

    ret.push({
      url: format.url,
      headers: []
    })

  }

  resolve(ret)

});


export default ytdl;
