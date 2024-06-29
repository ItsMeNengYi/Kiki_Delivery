import gpiod
from time import sleep

# Define the chip and line offsets for your GPIO pins
chip = gpiod.Chip("gpiochip4")
lines = [17, 27, 22, 10, 11]  # GPIO pins IN1, IN2, IN3, IN4, ENA

# Define the sequence for stepping
seq = [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [1, 0, 0, 1],
]

# Set the initial state of the GPIO pins
for index, line in enumerate(lines):
    lines[index] = chip.get_line(line)
    lines[index].request(consumer="scissor_lift_control", type=gpiod.LINE_REQ_DIR_OUT)

lines[0].set_value(1)
rotation_count = 2000

def backward():
    for i in range (rotation_count):
        for fullStep in range(4):
            for pin in range(1, 5, 1):  
                lines[pin].set_value(seq[fullStep][pin - 1])
                sleep(0.001)

def forward():
    for i in range (rotation_count):
        for fullStep in range(4):
            for pin in range(4, 0, -1):  
                lines[pin].set_value(seq[fullStep][pin - 1])
                sleep(0.015)


while True:
    if input("continue?") == "0" :
        break
    # backward()
    # sleep(2)
    forward()
    sleep(2)

# Release the GPIO lines and close the chip
for line in lines:
    line.release()
chip.close()