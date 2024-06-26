import "/style.css"

import db from "/Database/dbFirestore";
import WebRTC from "/WebRTC/webRTC";
import VirtualJoystick from '/components/Joystick/joystick';

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

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const userEmail = getQueryParameter('email');
const userKey = getQueryParameter('key');
db.verifyUser(userEmail, userKey).then((result) => {
    if (result) {
        connectButton.style.backgroundColor = 'green';
        connectButton.textContent = 'Connect to Drone';
        connectButton.onclick = () => webrtc.initializeConnection();
    } else {
        connectButton.style.backgroundColor = 'red';
        connectButton.textContent = 'Authentication Failed';
    }
}); 
    

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
