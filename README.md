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

videoID = "04GiqLjRO3A"
ytdl.getInfo(videoID, {}, (err, info) => {
  if (err) console.log(err);
  let format = ytdl.chooseFormat(info.formats, { quality: '134' });
  if (format) {
    console.log('Format found!');
  }
});
```


# API
### ytdl.getBasicInfo(url, options, callback(err, info))

Use this if you only want to get metainfo from a video. 

### ytdl.getInfo(url, options, callback(err, info))

Gets metainfo from a video. Includes additional formats, and ready to download deciphered URL. This is what the `ytdl()` function uses internally.

### ytdl.downloadFromInfo(info, options)

Once you have received metadata from a video with the `ytdl.getInfo` function, you may pass that information along with other options to this function.

### ytdl.chooseFormat(formats, options)

Can be used if you'd like to choose a format yourself with the [options above](#ytdlurl-options).

```js
// Example of choosing a video format.
ytdl.getInfo(videoID, {}, (err, info) => {
  if (err) console.log(err);
  let format = ytdl.chooseFormat(info.formats, { quality: '134' });
  if (format) {
    console.log('Format found!');
  }
});
```

### ytdl.filterFormats(formats, filter)

If you'd like to work with only some formats, you can use the [`filter` option above](#ytdlurl-options).

```js
// Example of filtering the formats to audio only.
ytdl.getInfo(videoID, {}, (err, info) => {
  if (err) console.log(err);
  let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
  console.log('Formats with only audio: ' + audioFormats.length);
});
```

### ytdl.validateID(id)

Returns true if the given string satisfies YouTube's ID format.

### ytdl.validateURL(url)

Returns true if able to parse out a valid video ID.

### ytdl.getURLVideoID(url)

Returns a video ID from a YouTube URL.

### ytdl.getVideoID(str)

Same as the above `ytdl.getURLVideoID()`, but can be called with the video ID directly, in which case it returns it. This is what ytdl uses internally.

## Limitations

ytdl cannot download videos that fall into the following
* Regionally restricted (requires a [proxy](example/proxy.js))
* Private
* Rentals

YouTube intentionally rate limits downloads, particularly audio only formats, likely to prevent bandwidth abuse. The download rate is still faster than a media player can play the video, even on 2x. See [#294](https://github.com/fent/node-ytdl-core/issues/294).

Generated download links are valid for 6 hours, for the same IP address.

## Handling Separate Streams

Typically 1080p or better video does not have audio encoded with it. The audio must be downloaded separately and merged via an appropriate encoding library. `ffmpeg` is the most widely used tool, with many [react native modules available](https://www.npmjs.com/search?q=ffmpeg). Use the `format` objects returned from `ytdl.getInfo` to download specific streams to combine to fit your needs. Look at [example/ffmpeg.js](example/ffmpeg.js) for an example on doing this.

## What if it stops working?

Youtube updates their website all the time, it's not that rare for this to stop working. If it doesn't work for you and you're using the latest version, feel free to open up an issue. Make sure to check if there isn't one already with the same error.

If you'd like to help fix the issue, look at the type of error first. The most common one is

    Could not extract signature deciphering actions

Run the tests at `test/irl-test.js` located on [the original node implementation ytdl-core](https://github.com/fent/node-ytdl-core) just to make sure that this is actually an issue with ytdl-core.

    mocha test/irl-test.js

These tests are not mocked, and they actually try to start downloading a few videos. If these fail, then it's time to debug.

For getting started with that, you can look at the `extractActions()` function in [`/lib/sig.js`](https://github.com/fent/node-ytdl-core/blob/master/lib/sig.js).

For the sake of fast development time, It is better to debug on node than it is on react-native. When ytdl-core is working as expected then, you can port the necessary changes into react-native-ytdl
