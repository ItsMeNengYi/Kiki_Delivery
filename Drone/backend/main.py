from pySocket import PySocket
from droneControl import DroneControl
from piScreen import PiScreen
from scissorLift import ScissorLift
from cameraGimbal import CameraGimbal
from time import sleep

pysocket = PySocket()
droneControl = DroneControl()
# screen = PiScreen()
lift = ScissorLift()
camera = CameraGimbal()

pysocket.initialise_server()

def on_message_callback(message):
    droneControl.on_message_callback(message)
    lift.on_data_callback(message["lift"])
    camera.on_message_callback(message)


pysocket.set_drone_on_message_callback(on_message_callback)

# droneControl.addTextScreen(screen)

while True:
    if pysocket.serverIsClosed:
        break
    droneControl.update()
    # screen.update()
    lift.update()
    camera.update()
    sleep(0.001)

