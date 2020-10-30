const getInfo = require('./info');
const util = require('./util');
const sig = require('./sig');


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
ytdl.chooseFormat = util.chooseFormat;
ytdl.filterFormats = util.filterFormats;
ytdl.validateID = util.validateID;
ytdl.validateURL = util.validateURL;
ytdl.getURLVideoID = util.getURLVideoID;
ytdl.getVideoID = util.getVideoID;
ytdl.cache = {
  sig: sig.cache,
  info: getInfo.cache,
  cookie: getInfo.cookieCache
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

  let err = util.playError(info, 'UNPLAYABLE');
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
    format = util.chooseFormat(info.formats, options);
  } catch (e) {
    reject(e);
    return;
  }

  const ret = [];
  if (!format.isHLS && !format.isDashMPD) {    
    
    if (options.begin) {
      format.url += `&begin=${util.humanStr(options.begin)}`;
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
