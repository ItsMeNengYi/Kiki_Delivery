from gpiozero import AngularServo
from time import time


class CameraGimbal():
    def __init__(self):
        self.width_min = 544 / 1000000 
        self.width_max = 2400 / 1000000
        self.freq = 333
        self.pitch_pin = 12
        self.yaw_pin = 18

        self.pitch_servo = AngularServo(self.pitch_pin, initial_angle= 135, min_angle=0, max_angle=270, min_pulse_width=self.width_min, max_pulse_width=self.width_max)
        self.yaw_servo = AngularServo(self.yaw_pin, initial_angle= 135, min_angle=0, max_angle=270, min_pulse_width=self.width_min, max_pulse_width=self.width_max)
    
        self.data = None
        self.joystick_x = 0
        self.joystick_y = 0

        self.yaw_angle = 135
        self.pitch_angle = 135

        self.prev_time = 0

    def on_message_callback(self, data):
        self.data = data
        self.joystick_x = float(self.data["cam"]["x"])
        self.joystick_y = -float(self.data["cam"]["y"])
        if self.yaw_angle != int(135 + self.joystick_y * 45) or self.pitch_angle != int(135 + -self.joystick_x * 45):
            self.yaw_angle = int(135 + self.joystick_y * 45)
            self.pitch_angle = int(135 + -self.joystick_x * 45)
            self.pitch_servo.angle = self.pitch_angle
            self.yaw_servo.angle = self.yaw_angle
            self.prev_time = time()

    def update(self):
        if (time() - self.prev_time > 0.04):
            self.close_servo()
        

    def close_servo(self):
        self.pitch_servo.detach() 
        self.yaw_servo.detach()

# from rpi_hardware_pwm import HardwarePWM
# from time import sleep
# from time import time

# pwm = HardwarePWM(pwm_channel=2, hz=333, chip=2)
# pwm.start(100)
# pwm.change_duty_cycle((2400 / 1000000)/(1/333)*100 ) # full duty cycle
# prev = time()
# sleep(10)
# print(time() - prev)
# pwm.stop() 