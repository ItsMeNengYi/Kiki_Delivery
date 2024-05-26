import json

class DroneControl():
    def __init__(self):
        self.dataFromClient = None
        self.data = None
    
    def on_message_callback(self, data):
        self.data = data
        print("Drone received" + json.dumps(data))