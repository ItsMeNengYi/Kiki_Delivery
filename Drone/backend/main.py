from pySocket import PySocket
from droneControl import DroneControl
from piScreen import PiScreen
from time import sleep

pysocket = PySocket()
droneControl = DroneControl()
# screen = PiScreen()

pysocket.initialise_server()
pysocket.set_drone_on_message_callback(droneControl.on_message_callback)

# droneControl.addTextScreen(screen)

while True:
    if pysocket.serverIsClosed:
        break
    droneControl.update()
    # screen.update()
    sleep(0.001)

