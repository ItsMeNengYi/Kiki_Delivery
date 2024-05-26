import "./style.css";

import WebRTC from "./WebRTC/webRTC";
import Socket from "./Backend/socket";


const webRTC = new WebRTC();
const server = new Socket();

webRTC.initializeConnection();
server.initialise();

webRTC.setOnDataCallback((data) => server.sendData(data));

document.getElementById("pythonServerDisconnect").onclick = async () => {
    server.sendData("end")
};