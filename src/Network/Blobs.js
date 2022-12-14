import { Storage } from 'aws-amplify';
import { v4 } from 'uuid';

export const uploadImage = async uri => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const urlParts = uri.split('.');
  const extension = urlParts[urlParts.length - 1];
  const key = `${v4()}.${extension}`;
  await Storage.put(key, blob);
  return key;
};
