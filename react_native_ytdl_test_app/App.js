/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Alert
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ytdl from 'react-native-ytdl';
import RNFetchBlob from 'rn-fetch-blob';

const runTests = async () => {
  const URL = 'https://www.youtube.com/watch?v=04GiqLjRO3A';

  const downloadURLsToFile = (URLs, path, progressCallback) =>
    new Promise(async (resolve, reject) => {

      for (let i = 0; i < URLs.length; i++) {
        let { url, headers } = URLs[i];

        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to external storage to download the file',
            }
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Denied!',
              'You need to give storage permission to download the file'
            );
            return;
          }

          Alert.alert('Permission granted', 'Permission has been granted!');

          const fileAlreadyExists = await RNFetchBlob.fs.exists(path);
          if (fileAlreadyExists) {
            await RNFetchBlob.fs.unlink(path);
          }

          const res = await RNFetchBlob.config({
            path,
            overwrite: false,
          }).fetch('GET', url, headers)
            .progress((received, total) => {
              if (progressCallback) {
                progressCallback((received * (i + 1)) / (total * URLs.length));
              }
            })
            .catch(err => console.error(`Could not save:"${path}" Reason:`, err));

          const contentType = res.respInfo.headers['Content-Type'];
          if (contentType) {
            const extension = contentType.split('/')[1];
            path = `${path}.${extension}`;
            await RNFetchBlob.fs.mv(res.path(), path);
          }
          console.log('The file is saved to:', path);

        } catch (e) {
          console.error(e);
          reject(e);
        }

      }
      resolve(path);

    });
  const testURLIsValidAndVideoIdIsExtracted = async () => {
    /**
     * Just Testing getVideoID(URL) with URL input (not videoId) will implicitly test the following as well:
     * - ytdl.validateURL()
     * - ytdl.getURLVideoID()
     */
    console.log('[TEST] "testURLIsValidAndVideoIdIsExtracted" has started');
    const videoId = await ytdl.getVideoID(URL);
    if (videoId !== '04GiqLjRO3A') {
      console.error('[TEST FAILED] "testURLIsValidAndVideoIdIsExtracted"');
      console.error(`EXPECTED "videoId === '04GiqLjRO3A'" BUT GOT "${videoId}"`);
    } else {
      console.log('[TEST] "testURLIsValidAndVideoIdIsExtracted" has passed');
    }
  };

  const testDownloadableURLIsSavedToFile = async () => {
    /**
     * Just Testing ytdl(, {quality:'highestaudio'}) will implicitly test the following as well:
     * - ytdl.chooseFormat()
     * - ytdl.getInfo()
     * - ytdl.getBasicInfo()
     */
    console.log('[TEST] "testDownloadableURLIsSavedToFile" has started');
    const downloadableURLs = await ytdl(URL, { quality: 'highestaudio' });
    const path = RNFetchBlob.fs.dirs.DownloadDir + '/file-name.tmp-ext';
    const savedPath = await downloadURLsToFile(downloadableURLs, path,
      (progress) => console.log('download progress', progress));

    const fileStat = await RNFetchBlob.fs.stat(savedPath);
    const size = fileStat.size;

    if (size < 687230) {
      console.error('[TEST FAILED] "testDownloadableURLIsSavedToFile"');
      console.error(`EXPECTED "size >= 687230" BUT GOT "${size}"`);
    } else {
      console.log('[TEST] "testDownloadableURLIsSavedToFile" has passed');
    }
  };

  const testCache = () => {
    /**
     * Cache will be filled with data after a URLs info has been retrieved or
     * if html5player player tokens are saved.
     *
     * Note: This test needs to be run after fetching a downloadable URL
     */
    console.log('[TEST] "testCache" has started');
    const cache = ytdl.cache;
    if (!cache.sig || !cache.info) {
      console.error('[TEST FAILED] "testCache"');
      console.error(`EXPECTED "cache.sig && cache.info" BUT GOT "cache.sig: ${cache.sig}" cache.info:"${cache.info}"`);
    } else {
      console.log('[TEST] "testCache" has passed');
    }
  };
  console.log('###########################################');
  console.log('###########################################');
  console.log('###########################################');
  console.log('###########################################');
  console.log('############# STARTING TESTS ##############');
  console.log('###########################################');
  console.log('NOTE: Testing should be done on a physical device so the file storage permission can be easily enabled');
  console.log('###########################################');

  testURLIsValidAndVideoIdIsExtracted();
  await testDownloadableURLIsSavedToFile();
  testCache();

  console.log('###########################################');
  console.log('###########################################');
  console.log('###########################################');
  console.log('###########################################');
  console.log('####### TESTS HAVE FINISHED RUNNING #######');
  console.log('###########################################');
};

const App = () => {
  runTests();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
