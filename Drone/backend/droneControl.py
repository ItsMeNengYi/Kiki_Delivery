import threading
import json
import math
import gpiod

from piScreen import PiScreen

from time import sleep

# Pins
_RIGHT_IN3 = 13
_RIGHT_IN4 = 19
_RIGHT_EN = 26
_LEFT_IN1 = 20
_LEFT_IN2 = 16
_LEFT_EN = 21

class DroneControl():
    def __init__(self):
        self.dataFromClient = None
        self.data = {
                "message": "none",
                "movement" : {
                    "x" : 0,
                    "y" : 0
                }
            }

        # Screens
        self.textScreen = None
        
        # Chip
        self._chip = gpiod.Chip('gpiochip4')
    
        # gpio lines
        self._line_left_en = self._chip.get_line(_LEFT_EN)
        self._line_left_in1 = self._chip.get_line(_LEFT_IN1)
        self._line_left_in2 = self._chip.get_line(_LEFT_IN2)
        self._line_right_in3 = self._chip.get_line(_RIGHT_IN3)
        self._line_right_in4 = self._chip.get_line(_RIGHT_IN4)
        self._line_right_en = self._chip.get_line(_RIGHT_EN)

        # motor variables
        self.left_wheels_speed = 0
        self.right_wheels_speed = 0
        self.speed = 0
        self.direction = True

        # joystick values
        self.joystick_motor_y = 0
        self.joystick_motor_x = 0

        self.rot_left = False
        self.rot_right = False

        self.initialise()

    def __del__(self):
        self._line_left_en.release()
        self._line_left_in1.release()
        self._line_left_in2.release()
        self._line_right_in3.release()
        self._line_right_in4.release()
        self._line_right_en.release()

    def initialise(self):
        self._line_left_en.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_left_in1.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_left_in2.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_right_in3.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_right_in4.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_right_en.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        
        self.set_value_all_lines(0)

        left_pwm_thread = threading.Thread(target=self.left_pwm_control)
        left_pwm_thread.start()  
        right_pwm_thread = threading.Thread(target=self.right_pwm_control)
        right_pwm_thread.start()  

    
    def on_message_callback(self, data):
        if self.textScreen != None and data["message"] != self.data["message"]:
            self.textScreen.add_message(data["message"])
        self.data = data
        self.joystick_motor_x = float(self.data["movement"]["x"])
        self.joystick_motor_y = -float(self.data["movement"]["y"])
        self.rot_left = bool(self.data["rot"]["left"])
        self.rot_right = bool(self.data["rot"]["right"])

    def left_pwm_control(self):
        while True:
            try:
                self._line_left_en.set_value(1)
                sleep(self.left_wheels_speed / 1000)
                self._line_left_en.set_value(0)
                sleep((1 - self.left_wheels_speed) / 1000)
            except :
                print("left")

    def right_pwm_control(self):
        while True:
            try:
                self._line_right_en.set_value(1)
                sleep(self.right_wheels_speed / 1000)
                self._line_right_en.set_value(0)
                sleep((1 - self.right_wheels_speed) / 1000)
            except :
                print("right")
    
    def set_value_all_lines(self, value):
        self._line_left_en.set_value(value)
        self._line_left_in1.set_value(value)
        self._line_left_in2.set_value(value)
        self._line_right_in3.set_value(value)
        self._line_right_in4.set_value(value)
        self._line_right_en.set_value(value)
    
    def update_wheels_speed(self, rot = False):
        if not rot:
            self.speed = round(math.sqrt(self.joystick_motor_x**2 + self.joystick_motor_y ** 2),2)
            self.left_wheels_speed = self.speed
            self.right_wheels_speed = self.speed

            if self.joystick_motor_x != 0:
                decelerate = math.sin(math.atan(abs(self.joystick_motor_y / self.joystick_motor_x)))
                if self.joystick_motor_x > 0:
                    self.right_wheels_speed = decelerate
                else:
                    self.left_wheels_speed = decelerate
        else:
            self.left_wheels_speed = 1
            self.right_wheels_speed = 1

    def update(self):
        if self.rot_left or self.rot_right:
            if self.rot_left:
                self._line_right_in3.set_value(1)
                self._line_right_in4.set_value(0)
                self._line_left_in2.set_value(0)
                self._line_left_in1.set_value(1)
            elif self.rot_right:
                self._line_right_in3.set_value(0)
                self._line_right_in4.set_value(1)
                self._line_left_in1.set_value(0)
                self._line_left_in2.set_value(1)
        else:
            if (self.speed != 0):
                if (self.direction != (self.joystick_motor_y > 0)):
                    self.direction = self.joystick_motor_y > 0
                    # Forward
                    if (self.direction):
                        self._line_right_in3.set_value(1)
                        self._line_right_in4.set_value(0)
                        self._line_left_in1.set_value(0)
                        self._line_left_in2.set_value(1)
                    else:
                        self._line_right_in3.set_value(0)
                        self._line_right_in4.set_value(1)
                        self._line_left_in2.set_value(0)
                        self._line_left_in1.set_value(1)
            else:
                self.set_value_all_lines(0)

        self.update_wheels_speed(self.rot_left or self.rot_right)

    def addTextScreen(self, screen):
        self.textScreen = screen

