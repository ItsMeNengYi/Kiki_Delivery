import firebase from 'firebase/app';
import 'firebase/firestore';
import { random } from 'lodash';

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

class dbFirestore  {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.dbInstance = firebase.firestore(); 
        this.accessCodeDoc = null
        this.accessCode = null

        this.userDataDoc = null
        this.userData = null

        this.callDoc = this.dbInstance.collection('calls').doc('DroneConnection');
        this.answerCandidates =  this.callDoc.collection('answerCandidates');
        this.offerCandidates = this.callDoc.collection('offerCandidates');
    }

    async getAccessCode() {
        if (this.accessCodeDoc === null) {
            this.accessCodeDoc = await this.dbInstance.collection('access_code').doc('00001');
        }
        if (this.accessCodeDoc !== null) {
            const access_code_data = (await this.accessCodeDoc.get()).data();
            this.accessCode = access_code_data.curr_access_code;
            await this.updataAccessCode();
            return this.accessCode;
        }
        console.log("Error, cant find access code");
    }

    async getUserData(userEmail) {
        const userSnapshot = (await this.dbInstance.collection('user_data').where("email", "==", userEmail).get());
        if (!userSnapshot.empty) {
            this.userDataDoc = userSnapshot.docs[0];
            this.userData = this.userDataDoc.data();
            return this.userData;
        } else {
            console.log("No such user!");
            return null;
        }
    }

    async updataAccessCode() {
        if (this.accessCodeDoc != null) {
            const new_access_code = {
                curr_access_code: Math.floor(Math.random() * 100000000),
                prev_access_code: this.accessCode,
            }
            await this.accessCodeDoc.update( new_access_code );
        } else {
            console.log("Access Code Document not found!");
        }
    }

    async verifyUser(userEmail, accessCode) {
        if ((await this.getUserData(userEmail)) != null && accessCode == (await this.getAccessCode())) {
            console.log("access granted!")
            return true;
        } else {
            console.log("access failed");
            return false;
        }
    }

    async getCallData() {
        return (await this.callDoc.get()).data();
    }

    async updateCallDoc(value) {
        await this.callDoc.update({value})
    }
}

let db;export default db = new dbFirestore();