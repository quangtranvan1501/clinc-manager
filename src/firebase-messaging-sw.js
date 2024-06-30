importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyA8XAOesOOMahEaUlmFOGlZgEndaGY0Wfs",
    authDomain: "phongkhamthaithinh-d945b.firebaseapp.com",
    databaseURL: "https://phongkhamthaithinh-d945b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "phongkhamthaithinh-d945b",
    storageBucket: "phongkhamthaithinh-d945b.appspot.com",
    messagingSenderId: "653026696852",
    appId: "1:653026696852:web:d336e4cc20a7dd99ba9e81",
    measurementId: "G-X0100P8TRS"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
