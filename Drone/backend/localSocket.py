import socket

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.bind(('localhost', 8765))
client_socket.listen(5)

while True:
    connection, address = client_socket.accept()
    data = connection.recv(1024)
    if len(data) > 0:
        print(data)
