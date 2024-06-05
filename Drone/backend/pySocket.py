import tornado.ioloop
import tornado.web
import tornado.websocket
import threading
import json

# WebSocket server settings
HOST = 'localhost'
PORT = 8765

class PySocket():
    def __init__(self):
        self.serverIsClosed = True
        self.droneOnMessageCallback = None
        self.app = tornado.web.Application([
            (r"/", App, dict(py_socket_instance=self)),
        ])   
        
    def initialise_server(self):
        self.app.listen(PORT)
        print(f"WebSocket server is listening on ws://{HOST}:{PORT}")
        self.server_thread = threading.Thread(target=tornado.ioloop.IOLoop.current().start)
        self.server_thread.start()
        self.serverIsClosed = False

    def close_server(self):
        print("Server closed")
        self.serverIsClosed = True
        tornado.ioloop.IOLoop.current().stop()

    def set_drone_on_message_callback(self, function):
        self.droneOnMessageCallback = function
    
    def send_to_drone(self, message):
        if self.droneOnMessageCallback is not None:
            try:
                message = json.loads(message)
                self.droneOnMessageCallback(message)
            except ValueError:
                print("not control message")
    
class App(tornado.websocket.WebSocketHandler):
    clients = set()
    disconnectMessage = "end"
    isConnected = False

    def initialize(self, py_socket_instance):
        self.py_socket_instance = py_socket_instance

    def on_message(self, message):
        print("frontend:" + message)
        if message == self.disconnectMessage:
            self.py_socket_instance.close_server()
        self.py_socket_instance.send_to_drone(message)

    def open(self):
        print("WebSocket connection opened")
        self.clients.add(self)
        self.isConnected = True

    def on_close(self):
        print("WebSocket connection closed")
        self.clients.remove(self)
        self.isConnected = False

    def send_message_to_web(self, message):
        if self.isConnected:
            self.write_message(message)
        else:
            print("Cannot send message, no active WebSocket connection")

    @classmethod
    def send_message_to_all(cls, message):
        for client in cls.clients:
            client.write_message(message)

    def check_origin(self, origin):
        return True  # Allow all origins
