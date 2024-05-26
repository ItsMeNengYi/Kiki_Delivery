from pySocket import PySocket
from droneControl import DroneControl

pysocket = PySocket()
pysocket.initialise_connection()

dronControl = DroneControl()
pysocket.set_drone_on_message_callback(dronControl.on_message_callback)