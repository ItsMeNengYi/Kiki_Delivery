import threading
import json
import math
import gpiod

from time import sleep

# Pins
_LEFT_IN3 = 6
_LEFT_IN4 = 13
_LEFT_EN = 19
_RIGHT_IN1 = 14
_RIGHT_IN2 = 15
_RIGHT_EN = 18

class DroneControl():
    def __init__(self,):
        self.dataFromClient = None
        self.data = {
                "message": "none",
                "movement" : {
                    "x" : 0,
                    "y" : 0
                },
                "inPlaceRot" : {
                    "left" : "false",
                    "right" : "false"
                }
            }

        # Chip
        self._chip = gpiod.Chip('gpiochip4')

        # gpio lines
        self._line_left_en = self._chip.get_line(_LEFT_EN)
        self._line_left_in3 = self._chip.get_line(_LEFT_IN3)
        self._line_left_in4 = self._chip.get_line(_LEFT_IN4)
        self._line_right_in1 = self._chip.get_line(_RIGHT_IN1)
        self._line_right_in2 = self._chip.get_line(_RIGHT_IN2)
        self._line_right_en = self._chip.get_line(_RIGHT_EN)

        self.initialise()

    def __del__(self):
        self._line_left_en.release()
        self._line_left_in3.release()
        self._line_left_in4.release()
        self._line_right_in1.release()
        self._line_right_in2.release()
        self._line_right_en.release()

    def initialise(self):
        self._line_left_en.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_left_in3.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_left_in4.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_right_in1.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_right_in2.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line_right_en.request(consumer='motor_control', type=gpiod.LINE_REQ_DIR_OUT)
        
        self.set_value_all_lines(0)
    
    def on_message_callback(self, data):
        self.data = data
        print("Drone received" + json.dumps(data))

    def pwm_control(self):
        while True:
            self._line_left_en.set_value(1)
            self._line_right_en.set_value(1)
            sleep(self.get_speed() / 1000)
            self._line_left_en.set_value(0)
            self._line_right_en.set_value(0)
            sleep((1 - self.get_speed()) / 1000)
    
    def set_value_all_lines(self, value):
        self._line_left_en.set_value(value)
        self._line_left_in3.set_value(value)
        self._line_left_in4.set_value(value)
        self._line_right_in1.set_value(value)
        self._line_right_in2.set_value(value)
        self._line_right_en.set_value(value)

    def get_x_val(self):
        return float(self.data["movement"]["x"])
    
    def get_y_val(self):
        return float(self.data["movement"]["y"])
    
    def get_speed(self):
        if (self.get_x_val() == 0):
            return self.get_y_val()
        sita = math.atan(abs(self.get_y_val() / self.get_x_val()))
        return math.sin(sita)
    
    def get_direction(self):
        # True forward, false backward
        return self.get_x_val() > 0

    def is_moving(self):
        return abs(self.get_x_val()) + abs(self.get_y_val()) != 0; 

    def update_lines_value(self):
        if (self.is_moving()):
            # Forward
            if (self.get_direction()):
                self._line_left_in3.set_value(0)
                self._line_left_in4.set_value(1)
                self._line_right_in1.set_value(1)
                self._line_right_in2.set_value(0)
            else:
                self._line_left_in3.set_value(1)
                self._line_left_in4.set_value(0)
                self._line_right_in1.set_value(0)
                self._line_right_in2.set_value(1)

        else:
            self.set_value_all_lines(0)


    def update(self):
        pwm_thread = threading.Thread(target=self.pwm_control)
        pwm_thread.start()  

        self.update_lines_value()


