import "./style.css";

import WebRTC from "./WebRTC/webRTC";
import Socket from "./Backend/socket";


const webRTC = new WebRTC();
const socket = new Socket();

webRTC.initializeConnection();
socket.initialise();

webRTC.setOnDataCallback((data) => socket.sendData(data));
