import { getFullInfo, getBasicInfo } from "./info";
import {
  filterFormats,
  validateID,
  validateURL,
  getURLVideoID,
  getVideoID
} from "./util";

let ytdl = {
  filterFormats,
  getBasicInfo,
  validateID,
  validateURL,
  getURLVideoID,
  getVideoID,

  getInfo: getFullInfo
};

export default ytdl;
