export default class Socket {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8765');
        this.socketReady = false;
    }

    initialise() {
        socket.onopen = () => {
            console.log('Connected to server!');
            socket.send('Hello from frontend!')
            this.socketReady = true;
        };
        socket.onmessage = (event) => this.onDataCallback(event.data);
        
        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    onDataCallback(data) {
        console.log("Received:" + data);
    }

    sendData(data) {
        if (this.socketReady) {
            socket.send(data);
        } else {
            console.log("Error, socket is not ready");
        }
    }
}
