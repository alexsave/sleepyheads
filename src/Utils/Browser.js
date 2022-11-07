import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';

export const urlOpener = async (url, redirectUrl) => {
  await InAppBrowser.isAvailable();
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false
  });

  if (type === 'success')
    Linking.openURL(newUrl);

};
