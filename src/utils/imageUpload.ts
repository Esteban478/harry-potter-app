import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const MIN_DIMENSION = 200;
export const MAX_DIMENSION = 1000;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  const fileRef = ref(storage, `profilePictures/${userId}/${file.name}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

const checkMagicNumbers = (file: File): Promise<boolean> => {
return new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = function(e) {
    if (e.target?.readyState === FileReader.DONE) {
      const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      // Check for JPEG or PNG headers
      const isValid = header.startsWith('ffd8') || header === '89504e47';
      resolve(isValid);
    }
  };
  reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

export const validateFile = async (file: File): Promise<boolean> => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
    console.log('Invalid file type');
    return false;
  }

  // Check magic numbers
  const isValidMagicNumber = await checkMagicNumbers(file);
  if (!isValidMagicNumber) {
    console.log('Invalid file content');
    return false;
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    console.log('File too large');
    return false;
  }

  // Check image dimensions
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const isValidDimensions = 
          img.width >= MIN_DIMENSION &&
          img.height >= MIN_DIMENSION &&
          img.width <= MAX_DIMENSION &&
          img.height <= MAX_DIMENSION;
        
        if (!isValidDimensions) {
          console.log('Invalid image dimensions');
        }
        
        resolve(isValidDimensions);
      };
    };
  });
};