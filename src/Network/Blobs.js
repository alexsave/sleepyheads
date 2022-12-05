import {Storage} from 'aws-amplify';
import { v4 } from 'uuid';

export const uploadImage = async uri => {
  console.log('uploading image')
  const response = await fetch(uri);
  console.log('getting blob')
  const blob = await response.blob();
  const urlParts = uri.split('.');
  const extension = urlParts[urlParts.length - 1];
  const key = `${v4()}.${extension}`;
  console.log('key ', key);
  await Storage.put(key, blob);
  return key;
};
