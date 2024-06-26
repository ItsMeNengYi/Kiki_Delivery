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

        this.prevData = null;
    }

    async initializeMediaStream() {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
            event.candidate && db.answerCandidates.add(event.candidate.toJSON());
        };
    
        // Here
        // const callData = (await this.callDoc.get()).data();
        const callData = await db.getCallData();
        const offerDescription = callData.offer;
        await this.pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
    
        const answerDescription = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answerDescription);
    
        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };
    
        await db.updateCallDoc(answer);
        
        db.offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
            let data = change.doc.data();
                this.pc.addIceCandidate(new RTCIceCandidate(data));
            }
        });
        });
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
}
