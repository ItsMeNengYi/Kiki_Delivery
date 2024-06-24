import "/style.css"

import firebase from 'firebase/app';
import 'firebase/firestore';
import WebRTC from "/WebRTC/webRTC";
import VirtualJoystick from '/components/Joystick/joystick';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

let _droneControl = {
    message:"none",
    movement : {
        x : 0,
        y : 0
    }  
}

const webrtc = new WebRTC();
webrtc.initializeMediaStream();
webrtc.initializeDataStream();

const connectButton = document.getElementById('connectButton');
connectButton.textContent = 'Authenticating...';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.firestore();
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const userEmail = getQueryParameter('email');
const userKey = getQueryParameter('key');
let userExist = false
let access = false

async function userAuthentication() {
    try { 
        const accessCodeDoc = (await database.collection('access_code').doc('00001').get());
        const accessCode = accessCodeDoc.data().curr_access_code;
        const userSnapshot = (await database.collection('user_data').where("email", "==", userEmail).get());

        if (!userSnapshot.empty) {
            const user = userSnapshot.docs[0].data();
            userExist = true
        } else {
            console.log("No such user!");
        }

        if (accessCode === userKey && userExist) {
            console.log("access granted!")
            access = true
            connectButton.style.backgroundColor = 'green';
            connectButton.textContent = 'Connect to Drone';
            connectButton.onclick = () => webrtc.initializeConnection();
        } else {
            console.log("access failed");
            connectButton.style.backgroundColor = 'red';
            connectButton.textContent = 'Authentication Failed';
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
userAuthentication();


document.getElementById('send').onclick = async ()=> {
    _droneControl.message = document.getElementById('inputForDrone').value;
    webrtc.sendToDrone(_droneControl);  
};

const movementJoystickContainer = document.querySelector('.movementJoystick');
const movementJoystick = new VirtualJoystick(movementJoystickContainer, {
    width: 100,
    height: 100,
    color: 'gray',
    handleColor: 'white',
    handleRadius: 30,
    onChange: function(delta) {
        const x = Math.round(delta.x*100)/100;
        const y = Math.round(delta.y*100)/100; 
        _droneControl.movement.x = x;
        _droneControl.movement.y = y;
        webrtc.sendToDrone(_droneControl);  
    }
}
);

const cameraJoystickContainer = document.querySelector('.cameraJoystick');
const cameraJoystick = new VirtualJoystick(cameraJoystickContainer, {
    width: 100,
    height: 100,
    color: 'gray',
    handleColor: 'white',
    handleRadius: 30,
    onChange: function(delta) {
        const x = Math.round(delta.x*100)/100;
        const y = Math.round(delta.y*100)/100; 
        _droneControl.movement.x = x;
        _droneControl.movement.y = y;
        webrtc.sendToDrone(_droneControl);  
    }
}
);
