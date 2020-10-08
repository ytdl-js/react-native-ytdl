# react-native-ytdl

YouTube video and audio stream extractor for react native.

This module is a port of [ytdl-core](https://github.com/fent/node-ytdl-core). All the functionality was ported successfully except for a couple of methods which react native does not support(such as node's streaming api).

# Installation

```
npm install react-native-ytdl
```

# Usage

```js
import ytdl from "react-native-ytdl"

const youtubeURL = 'http://www.youtube.com/watch?v=04GiqLjRO3A';
const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
console.log(urls)
```


# API
### ytdl(url, [options])

Attempts to get a downloadable link from the given YouTube URL. Returns a list of URLs with required headers. `options` can have the following keys

* `quality` - Video quality to download. Can be an [itag value](http://en.wikipedia.org/wiki/YouTube#Quality_and_formats), a list of itag values, or `highest`/`lowest`/`highestaudio`/`lowestaudio`/`highestvideo`/`lowestvideo`. `highestaudio`/`lowestaudio`/`highestvideo`/`lowestvideo` all prefer audio/video only respectively. Defaults to `highest`, which prefers formats with both video and audio.

  A typical video's formats will be sorted in the following way using `quality: 'highest'`
  ```
  itag container quality codecs                 bitrate  audio bitrate
  18   mp4       360p    avc1.42001E, mp4a.40.2 696.66KB 96KB
  137  mp4       1080p   avc1.640028            4.53MB
  248  webm      1080p   vp9                    2.52MB
  136  mp4       720p    avc1.4d4016            2.2MB
  247  webm      720p    vp9                    1.44MB
  135  mp4       480p    avc1.4d4014            1.1MB
  134  mp4       360p    avc1.4d401e            593.26KB
  140  mp4               mp4a.40.2                       128KB
  ```
  format 18 at 360p will be chosen first since it's the highest quality format with both video and audio.
* `filter` - Used to filter the list of formats to choose from. Can be `audioandvideo` or `videoandaudio` to filter formats that contain both video and audio, `video` to filter for formats that contain video, or `videoonly` for formats that contain video and no additional audio track. Can also be `audio` or `audioonly`. You can give a filtering function that gets called with each format available. This function is given the `format` object as its first argument, and should return true if the format is preferable.
  ```js
  // Example with custom function.
  ytdl(url, { filter: format => format.container === 'mp4' })
  ```
* `format` - Primarily used to download specific video or audio streams. This can be a specific `format` object returned from `getInfo`.
  * Supplying this option will ignore the `filter` and `quality` options since the format is explicitly provided.
* `range` - A byte range in the form `{start: INT, end: INT}` that specifies part of the file to download, ie {start: 10355705, end: 12452856}. Not supported on segmented (DASH MPD, m3u8) formats.
  * This downloads a portion of the file, and not a separately spliced video.
* `begin` - What time in the video to begin. Supports formats `00:00:00.000`, `0ms, 0s, 0m, 0h`, or number of milliseconds. Example: `1:30`, `05:10.123`, `10m30s`.
  * For live videos, this also accepts a unix timestamp or Date object, and defaults to `Date.now()`.
  * This option is not very reliable for non-live videos, see [#129](https://github.com/fent/node-ytdl-core/issues/129), [#219](https://github.com/fent/node-ytdl-core/issues/219).
* `requestOptions` - Anything to merge into the request options which [fetch](https://reactnative.dev/docs/network) is called with, such as `headers`.
* `highWaterMark` - How much of the video download to buffer into memory. See [node's docs](https://nodejs.org/api/stream.html#stream_constructor_new_stream_writable_options) for more. Defaults to 512KB.
* `lang` - The 2 character symbol of a language. Default is `en`.

### async ytdl.getBasicInfo(url, [options])

Use this if you only want to get metainfo from a video.

### async ytdl.getInfo(url, [options])

Gets metainfo from a video. Includes additional formats, and ready to download deciphered URL. This is what the `ytdl()` function uses internally.

### ytdl.downloadFromInfo(info, options)

Once you have received metadata from a video with the `ytdl.getInfo` function, you may pass that information along with other options to this function.

### ytdl.chooseFormat(formats, options)

Can be used if you'd like to choose a format yourself with the [options above](#ytdlurl-options).
Throws an Error if it fails to find any matching format.

```js
// Example of choosing a video format.
let info = await ytdl.getInfo(videoID);
let format = ytdl.chooseFormat(info.formats, { quality: '134' });
console.log('Format found!', format);
```

### ytdl.filterFormats(formats, filter)

If you'd like to work with only some formats, you can use the [`filter` option above](#ytdlurl-options).

```js
// Example of filtering the formats to audio only.
let info = await ytdl.getInfo(videoID);
let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
console.log('Formats with only audio: ' + audioFormats.length);
```

### ytdl.validateID(id)

Returns true if the given string satisfies YouTube's ID format.

### ytdl.validateURL(url)

Returns true if able to parse out a valid video ID.

### ytdl.getURLVideoID(url)

Returns a video ID from a YouTube URL.
Throws an Error if it fails to parse an ID.

### ytdl.getVideoID(str)

Same as the above `ytdl.getURLVideoID()`, but can be called with the video ID directly, in which case it returns it. This is what ytdl uses internally.
Throws an Error if it fails to parse an ID.

## Limitations

ytdl cannot download videos that fall into the following
* Regionally restricted (requires a [proxy](https://github.com/fent/node-ytdl-core/example/proxy.js))
* Private (if you have access, requires [cookies](https://github.com/fent/node-ytdl-core/example/cookies.js))
* Rentals (if you have access, requires [cookies](https://github.com/fent/node-ytdl-core/example/cookies.js))

Generated download links are valid for 6 hours, for the same IP address.

## Handling Separate Streams

Typically 1080p or better video does not have audio encoded with it. The audio must be downloaded separately and merged via an appropriate encoding library. `ffmpeg` is the most widely used tool, with many [React Native modules available](https://www.npmjs.com/search?q=ffmpeg). Use the `format` objects returned from `ytdl.getInfo` to download specific streams to combine to fit your needs.

## What if it stops working?

Youtube updates their website all the time, it's not that rare for this to stop working. If it doesn't work for you and you're using the latest version, feel free to open up an issue. Make sure to check if there isn't one already with the same error.

If you'd like to help fix the issue, look at the type of error first. If you're getting the following error

    Could not extract signature deciphering actions

Run the tests at `test/irl-test.js` located on [the original node implementation ytdl-core](https://github.com/fent/node-ytdl-core) just to make sure that this is actually an issue with ytdl-core.

    mocha test/irl-test.js

These tests are not mocked, and they try to start downloading a few videos. If these fail, then it's time to debug.

For getting started with that, you can look at the `extractActions()` function in [`/lib/sig.js`](https://github.com/fent/node-ytdl-core/blob/master/lib/sig.js).

For the sake of fast development time, It is better to debug on node than it is on react-native. When ytdl-core is working as expected, then you can port the necessary changes into react-native-ytdl


# Install

```bash
npm install react-native-ytdl@latest
```

Or for Yarn users:
```bash
yarn add react-native-ytdl@latest
```

Make sure you're installing the latest version of react-native-ytdl to keep up with the latest fixes.

# Related Projects

- [ytdl-core](https://github.com/fent/node-ytdl-core) - The original node ytdl implementation.
- [ytdl](https://github.com/fent/node-ytdl) - A cli wrapper of this.
- [pully](https://github.com/JimmyBoh/pully) - Another cli wrapper of this aimed at high quality formats.
- [ytsr](https://github.com/TimeForANinja/node-ytsr) - YouTube video search results.
- [ytpl](https://github.com/TimeForANinja/node-ytpl) - YouTube playlist and channel resolver.
