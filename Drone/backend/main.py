from pySocket import PySocket
from droneControl import DroneControl
from piScreen import PiScreen

pysocket = PySocket()
droneControl = DroneControl()
screen = PiScreen()

pysocket.initialise_connection()
pysocket.set_drone_on_message_callback(droneControl.on_message_callback)

droneControl.addTextScreen(screen)

while True:
    if pysocket.serverIsClosed:
        break
    pysocket.update()
    droneControl.update()
    screen.update()