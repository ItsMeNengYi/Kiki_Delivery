import socket
import base64
import hashlib
import struct
import threading

# WebSocket server settings
HOST = 'localhost'
PORT = 8765

# Function to handle the WebSocket handshake
def perform_handshake(conn):
    request = conn.recv(1024).decode('utf-8')
    headers = parse_headers(request)
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
    conn.send(handshake_response.encode('utf-8'))
    print("Handshake complete")

# Function to parse headers from the request
def parse_headers(request):
    headers = {}
    lines = request.split('\r\n')
    for line in lines[1:]:
        if ': ' in line:
            key, value = line.split(': ', 1)
            headers[key] = value
    return headers

# Function to decode WebSocket frames
def decode_websocket_frame(frame):
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
        raise ValueError("Payload data length mismatch")

    decoded = bytearray(payload_length)
    for i in range(payload_length):
        decoded[i] = payload_data[i] ^ masking_key[i % 4]
    
    return decoded.decode('utf-8')

# Function to encode WebSocket frames
def encode_websocket_frame(message):
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

# Function to handle client communication
def handle_client(conn):
    try:
        perform_handshake(conn)
        while True:
            data = conn.recv(1024)
            if not data:
                break
            try:
                message = decode_websocket_frame(data)
                print(f"Received: {message}")
                response = encode_websocket_frame(f"Echo: {message}")
                conn.send(response)
            except (UnicodeDecodeError, ValueError) as e:
                print(f"Error decoding message: {e}")
                break
    finally:
        conn.close()

# Main server code
def main():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)
    print(f"WebSocket server is listening on ws://{HOST}:{PORT}")

    try:
        while True:
            conn, _ = server_socket.accept()
            threading.Thread(target=handle_client, args=(conn,)).start()
    finally:
        server_socket.close()

if __name__ == "__main__":
    main()
