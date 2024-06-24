import './style.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import { isEqual } from 'lodash'

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

        this.dataChannelReady = false;
        this.prevData = null;

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.database = firebase.firestore();
        this.callDoc = this.database.collection('calls').doc('DroneConnection');
        this.answerCandidates = this.callDoc.collection('answerCandidates');
        this.offerCandidates = this.callDoc.collection('offerCandidates');
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
            event.candidate && this.answerCandidates.add(event.candidate.toJSON());
        };
    
        const callData = (await this.callDoc.get()).data();
    
        const offerDescription = callData.offer;
        await this.pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
    
        const answerDescription = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answerDescription);
    
        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };
    
        await this.callDoc.update({ answer });
    
        this.offerCandidates.onSnapshot((snapshot) => {
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
