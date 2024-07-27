import './style.css';

import db from "/Database/dbFirestore";
import { isEqual } from 'lodash'

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ]
};

const _default_droneControl = {
    message:"none",
    movement : {
        x : 0,
        y : 0
    },
    lift : {
        up : false,
        down : false
    },
    rot : {
        left : false,
        right : false
    },
    cam : {
        x : 0,
        y : 0
    }
}
// const servers = {
//   iceServers: [
//     {
//       urls: "stun:stun.relay.metered.ca:80",
//     },
//     {
//       urls: "turn:global.relay.metered.ca:80",
//       username: "db4b5b12d498f6d2067c5885",
//       credential: "5hNcS8xmSKXHY9n/",
//     },
//     {
//       urls: "turn:global.relay.metered.ca:80?transport=tcp",
//       username: "db4b5b12d498f6d2067c5885",
//       credential: "5hNcS8xmSKXHY9n/",
//     },
//     {
//       urls: "turn:global.relay.metered.ca:443",
//       username: "db4b5b12d498f6d2067c5885",
//       credential: "5hNcS8xmSKXHY9n/",
//     },
//     {
//       urls: "turns:global.relay.metered.ca:443?transport=tcp",
//       username: "db4b5b12d498f6d2067c5885",
//       credential: "5hNcS8xmSKXHY9n/",
//     },
// ]
// };

export default class WebRTC {
    constructor() {
        this.pc = new RTCPeerConnection(servers);
        this.localStream = null;
        this.remoteStream = new MediaStream();
        this.dataChannel = null;

        this.dataChannelReady = false;
        this.prevData = null;

        this.startTime = 0;
        this.endTime = 0;
        this.userRemainingTime = 0; // in minutes
        this.countdownTime = 0; // in second

        this.connectButton = document.getElementById('connectButton');
        this.countdownInterval = null;
    }

    async initializeMediaStream() {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        this.remoteStream = new MediaStream();

        // Push tracks from local stream to peer connection
        this.localStream.getTracks().forEach((track) => {
            this.pc.addTrack(track, this.localStream);
        });

        // Pull tracks from remote stream, add to video stream
        this.pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
            this.remoteStream.addTrack(track);
            });
        };

        webcamVideo.srcObject = this.localStream;
        remoteVideo.srcObject = this.remoteStream;
    }

    async initializeDataStream() {
        this.pc.ondatachannel = (event) => {
            console.log("Data Channel Ready!");

            this.dataChannel = event.channel;
            this.dataChannel.onmessage = (event) => this.dataChannelOnMessageCallBack(event.data);
            
            document.getElementById('send').disabled = false;
            this.dataChannelReady = true;
        };
    }

    async initializeConnection() {
        this.pc.onicecandidate = (event) => {
            event.candidate && db.addAnswerCandidates(event.candidate.toJSON());
        };
        
        await this.pc.setRemoteDescription(new RTCSessionDescription((await db.getOfferDescription())));
        const answerDescription = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answerDescription);
        await db.setAnswerDescription(answerDescription);
        db.offerCandidatesOnSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                let data = change.doc.data();
                    this.pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });

        this.userRemainingTime = await db.getUserRemainingTime();
        this.countdownTime = this.userRemainingTime * 60;
        
        this.pc.onconnectionstatechange = async (event) => {
            if (this.pc.connectionState === "connected") {
                // Return current time in miliseconds and convert to second
                this.startTime = performance.now() / 1000;
                this.countdownInterval = setInterval(() => {
                    this.countdownTime = this.userRemainingTime * 60 - (performance.now() / 1000 - this.startTime);
                    document.getElementById('userTimeCountdown').textContent = Math.floor(this.countdownTime / 60) 
                                                                    + ' min ' 
                                                                    + Math.floor(this.countdownTime % 60)
                                                                    + ' sec remaining...';
                    if (this.countdownTime <= 0) {
                        clearInterval(this.countdownInterval); // Clear the interval
                        document.getElementById('userTimeCountdown').textContent = 'Time is up!';
                      }
                }, 1000);
                window.setTimeout(() => {
                    this.pc.close();
                    this.connectButton.textContent = "disconnected to drone";
                    this.connectButton.disabled = true;;
                    this.connectButton.style.backgroundColor = 'red';
                    clearInterval(this.countdownInterval); // Clear the interval
                }, this.userRemainingTime * 60 * 1000 );
                this.connectButton.textContent = "Connected! Press to Disconnect";
                this.connectButton.style.backgroundColor = 'green';
                this.connectButton.onclick = async ()=> {
                    this.closeConnection();
                };
            }
            if (this.pc.connectionState === "disconnected") {
                await this.onDisconnect();
            }
            
            if (this.pc.connectionState === "failed") {
                this.connectButton.textContent = "Connection failed";
                this.connectButton.style.backgroundColor = 'red';
            }

            if (this.pc.connectionState === "connecting") {
                this.connectButton.textContent = "Connecting...";
                this.connectButton.style.backgroundColor = 'yellow';
            }
          };
    }

    sendToDrone(data) {
        if (this.dataChannelReady) {
            // Send the data to drone only when it's different
            if (!isEqual(data, this.prevData)) {
                this.dataChannel.send(JSON.stringify(data));  
                this.prevData = JSON.parse(JSON.stringify(data));
            }
        } else {
            console.log("Error: Data channel not ready");
        }
    }

    dataChannelOnMessageCallBack(message) {
        console.log(message)
    }

    getConnectionState() {
        return this.pc.connectionState;
    }

    async closeConnection() {
        this.sendToDrone(_default_droneControl);
        this.pc.close();
        await this.onDisconnect();
    }

    async setUserTime(duration) {
        this.startTime = 0;
        await db.setUserRemainingTime(duration);
    }

    calculateDuration() {
        this.endTime = performance.now() / 1000;
        return this.endTime - this.startTime;
    }

    async onDisconnect() {
        this.connectButton.textContent = "Disconnected";
        this.connectButton.style.backgroundColor = 'red';
        this.connectButton.disabled = true;
        if (this.startTime != 0){
            clearInterval(this.countdownInterval);     
            const duration = this.calculateDuration();  
            document.getElementById('userTimeCountdown').textContent = Math.floor(duration / 60) 
                                                                            + ' min ' 
                                                                            + Math.floor(duration % 60 * 100) / 100.0
                                                                            + ' sec used';
            await this.setUserTime(Math.round(duration / 60.0 * 100)/100.0);
        }
    }
}