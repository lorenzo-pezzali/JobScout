import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyB1jpptj7K-GZOfV0mI2vFyja_5IPvu5DI',
  authDomain: 'jobfinder-f0a77.firebaseapp.com',
  projectId: 'jobfinder-f0a77',
  storageBucket: 'jobfinder-f0a77.firebasestorage.app',
  messagingSenderId: '226213671442',
  appId: '1:226213671442:web:c4a628159cae832caddecb',
  measurementId: 'G-8VFPYGJZ1X',
};

export const firebaseApp = initializeApp(firebaseConfig);

isSupported()
  .then((supported) => {
    if (supported) getAnalytics(firebaseApp);
  })
  .catch(() => {
    // Analytics unsupported in this environment (e.g. no cookies) - safe to skip.
  });
