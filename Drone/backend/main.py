from pySocket import PySocket
from droneControl import DroneControl

pysocket = PySocket()
pysocket.initialise_connection()


droneControl = DroneControl()
pysocket.set_drone_on_message_callback(droneControl.on_message_callback)

while True:
    if pysocket.serverIsClosed:
        break
    pysocket.update()
    droneControl.update()