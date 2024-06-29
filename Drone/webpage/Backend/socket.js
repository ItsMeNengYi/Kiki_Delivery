export default class Socket {
    constructor() {
        this.client = new WebSocket('ws://localhost:8765');
    }

    initialise() {
        this.client.addEventListener('open', (event) => {
            console.log('Connected to server!');
            this.client.send('hello from frontend');
        });

        this.client.addEventListener('message', (event) => { this.onDataCallback(event.data)});

        this.client.addEventListener('close', (event) => {
            console.log('Disconnected from server'); 
            this.client = new WebSocket('ws://localhost:8765');
            this.initialise()
        });

        this.client.addEventListener('error', (error) => {
            console.error('Socket error:', err);
        });
    }

    onDataCallback(data) {
        console.log("Received:" + data);
    }

    sendData(data) {
        if (this.client.readyState == WebSocket.OPEN) {
            this.client.send(data);
        } else {
            console.log("Error, socket is not initialised");
        }
    }
}
