import { uploadData } from 'aws-amplify/storage';
import { v4 } from 'uuid';

export const uploadImage = async uri => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const urlParts = uri.split('.');
  const extension = urlParts[urlParts.length - 1];
  const key = `${v4()}.${extension}`;
  // Amplify v6: uploadData returns a task; await its .result to finish the upload.
  await uploadData({ key, data: blob }).result;
  return key;
};
