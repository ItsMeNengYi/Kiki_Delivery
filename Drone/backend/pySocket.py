import socket
import base64
import hashlib
import struct
import threading

import json

# WebSocket server settings
HOST = 'localhost'
PORT = 8765

class PySocket():
    def __init__(self):
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.conn = None
        self.disconnectMessage = "end"

        self.droneOnMessageCallback = None

    def send_message_to_web(self, message):
        self.conn.send(self.encode_websocket_frame(message))
    
    def on_message(self, message):
        try:
            messageInJsonFormat = json.loads(message)
            if (self.droneOnMessageCallback != None and message != ""):
                self.droneOnMessageCallback(messageInJsonFormat)
        except ValueError:
            print("Data received not for Drone: " + message)
    
    def on_disconnect(self):
        print("Disconnected from web")

    def set_drone_on_message_callback(self, function):
        self.droneOnMessageCallback = function

    def initialise_connection(self):
        self.server_socket.bind((HOST, PORT))
        self.server_socket.listen(5)
        print(f"WebSocket server is listening on ws://{HOST}:{PORT}")
        self.conn, _ = self.server_socket.accept()

        # TODO: handling exception raise by thread
        threading.Thread(target=self.handle_client).start()

    def close_server(self):
        print("Server closed")
        self.server_socket.close()

    # Function to handle client communication
    def handle_client(self):
        self.perform_handshake()
        while True:
            data = self.conn.recv(1024)
            if not data:
                break
            try:
                message = self.decode_websocket_frame(data)
                if (message == self.disconnectMessage):
                    self.on_disconnect()
                    break
                self.on_message(message)
            except (UnicodeDecodeError, ValueError) as e:
                self.send_message_to_web("0")
                print(f"Error decoding message: {e}")

        self.conn.close()

    # Function to handle the WebSocket handshake
    def perform_handshake(self):
        request = self.conn.recv(1024).decode('utf-8')
        headers = self.parse_headers(request)
        sec_websocket_key = headers['Sec-WebSocket-Key']
        sec_websocket_accept = base64.b64encode(
            hashlib.sha1((sec_websocket_key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').encode('utf-8')).digest()
        ).decode('utf-8')
        handshake_response = (
            'HTTP/1.1 101 Switching Protocols\r\n'
            'Upgrade: websocket\r\n'
            'Connection: Upgrade\r\n'
            f'Sec-WebSocket-Accept: {sec_websocket_accept}\r\n\r\n'
        )
        self.conn.send(handshake_response.encode('utf-8'))
        print("Handshake complete")

    # Function to parse headers from the request
    def parse_headers(self, request):
        headers = {}
        lines = request.split('\r\n')
        for line in lines[1:]:
            if ': ' in line:
                key, value = line.split(': ', 1)
                headers[key] = value
        return headers

    # Function to decode WebSocket frames
    def decode_websocket_frame(self, frame):
        if len(frame) < 2:
            raise ValueError("Invalid frame length")
        
        byte1, byte2 = frame[:2]
        fin = byte1 & 0x80
        opcode = byte1 & 0x0F
        masked = byte2 & 0x80
        payload_length = byte2 & 0x7F

        if payload_length == 126:
            if len(frame) < 4:
                raise ValueError("Invalid frame length for payload length 126")
            payload_length = struct.unpack(">H", frame[2:4])[0]
            masking_key = frame[4:8]
            payload_data = frame[8:]
        elif payload_length == 127:
            if len(frame) < 10:
                raise ValueError("Invalid frame length for payload length 127")
            payload_length = struct.unpack(">Q", frame[2:10])[0]
            masking_key = frame[10:14]
            payload_data = frame[14:]
        else:
            masking_key = frame[2:6]
            payload_data = frame[6:]

        if len(payload_data) != payload_length:
            print("Error Payload data length mismatch")
            self.send_message_to_web("0")
            return ""

        decoded = bytearray(payload_length)
        for i in range(payload_length):
            decoded[i] = payload_data[i] ^ masking_key[i % 4]
        
        return decoded.decode('utf-8')

    # Function to encode WebSocket frames
    def encode_websocket_frame(self, message):
        frame = bytearray([0x81])
        message_bytes = message.encode('utf-8')
        length = len(message_bytes)

        if length <= 125:
            frame.append(length)
        elif length >= 126 and length <= 65535:
            frame.append(126)
            frame.extend(struct.pack('>H', length))
        else:
            frame.append(127)
            frame.extend(struct.pack('>Q', length))

        frame.extend(message_bytes)
        return frame

    

