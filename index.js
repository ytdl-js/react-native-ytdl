import util from "./util";
import info from "./info";

let ytdl = {
  filterFormats: util.filterFormats,
  validateID: util.validateID,
  validateURL: util.validateURL,
  getURLVideoID: util.getURLVideoID,
  getVideoID: util.getVideoID,
  chooseFormat: util.chooseFormat,

  getBasicInfo: info.getBasicInfo,
  getInfo: info.getFullInfo
};

export default ytdl;
