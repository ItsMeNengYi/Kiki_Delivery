import './style.css';

import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  /* your firebase config*/
};

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ]
};

export default class WebRTC {
  constructor() {
    this.pc = new RTCPeerConnection(servers);
    this.localStream = null;
    this.remoteStream = new MediaStream();
    this.dataChannel = this.pc.createDataChannel("message");

    this.dataChannelReady = false;

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.database = firebase.firestore();
    this.callDoc = this.database.collection("calls").doc("DroneConnection");
    this.answerCandidates = this.callDoc.collection("answerCandidates");
    this.offerCandidates = this.callDoc.collection("offerCandidates");

    this.onDataCallback = null;
  }

  async initializeMediaStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // // Push tracks from local stream to peer connection
    this.localStream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.localStream);
    });

    // Pull tracks from remote stream, add to video stream
    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    };

    // webcamVideo.srcObject = this.localStream;
    remoteVideo.srcObject = this.remoteStream;
  }

  async initializeDataStream() {
    this.dataChannel.onopen = () => {
      console.log("Data channel opened");
      this.dataChannelReady = true;
    };

    this.dataChannel.onmessage = (event) => this.dataChannelOnMessageCallBack(event.data);
  }

  async initializeConnection() {
    await this.initializeMediaStream();
    this.initializeDataStream();
    this.pc.onicecandidate = (event) => {
      event.candidate && this.offerCandidates.add(event.candidate.toJSON());
    };
    // Create offer
    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await this.callDoc.set({ offer });

    // Listen for remote answer
    this.callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!this.pc.currentRemoteDescription && data?.answer) {
        console.log("got answer!");
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    this.answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("got iceCandidates!");
          const candidate = new RTCIceCandidate(change.doc.data());
          this.pc.addIceCandidate(candidate);
        }
      });
    });

    this.pc.onconnectionstatechange = async (event) => {
      if (this.pc.connectionState === "disconnected") {
        await firestore.collection("calls").doc("DroneConnection").delete();
      }
    };
  }

  sendToDrone(data) {
    if (this.dataChannelReady) {
      this.dataChannel.send(data);
    } else {
      console.log("Error: Data channel not ready");
    }
  }

  setOnDataCallback(method) {
    this.onDataCallback = method;
  }

  dataChannelOnMessageCallBack(message) {
    document.getElementById("messageFromClient").textContent = message;
    if (this.onDataCallback != null) {
      this.onDataCallback(message);
    }
  }

  getConnectionState() {
    return this.pc.connectionState; 
  }
  
}
