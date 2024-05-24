import "/webRTC/style.css"
import "/style.css"

import WebRTC from "/WebRTC/webRTC";
import VirtualJoystick from '/components/Joystick/joystick';

let _droneControl = {
    message:"none",
    movement : {
        x : 0,
        y : 0
    },
    inPlaceRotation : {
        left : false,
        right : false
    },
    
}


const webrtc = new WebRTC();
webrtc.initializeMediaStream();
webrtc.initializeDataStream();

const connectButton = document.getElementById('connectButton');
connectButton.onclick = () => webrtc.initializeConnection();

document.getElementById('send').onclick = async ()=> {
    _droneControl.message = document.getElementById('inputForDrone').value;
    webrtc.sendToDrone(_droneControl);  
};

const joystickContainer = document.querySelector('.joystick');
const joystick = new VirtualJoystick(joystickContainer, {
    width: 100,
    height: 100,
    color: 'gray',
    handleColor: 'white',
    handleRadius: 30,
    onChange: function(delta) {
      document.getElementById('joystick-debug').textContent = "x:" 
      + String(Math.round(delta.x*100)/100) 
      + " y:" 
      + String(Math.round(delta.y*100)/100);
      _droneControl.movement.x = delta.x;
      _droneControl.movement.y = delta.y;
      webrtc.sendToDrone(_droneControl);  
    }
}
);

