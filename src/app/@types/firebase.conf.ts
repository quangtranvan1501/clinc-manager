import firebase from 'firebase/compat/app';
import { environment } from '../service/environments/environments';
import 'firebase/compat/messaging';

firebase.initializeApp(environment.firebaseConfig);
export const messaging = firebase.messaging();