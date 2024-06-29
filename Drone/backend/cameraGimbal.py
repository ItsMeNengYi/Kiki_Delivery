# import threading
# import json
# import math
# import gpiod

# from time import sleep

# # Pins
# _PITCH_PIN = 12
# _YAW_PIN = 24

# class Gimbal():
#     def __init__(self):
#         # Chip
#         self._chip = gpiod.Chip('gpiochip4')

#         # gpio lines
#         self._line_pitch = self._chip.get_line(_PITCH_PIN)
#         self._line_yaw = self._chip.get_line(_YAW_PIN)

#         self.servo_min_pulse_width = 544
#         self.servo_max_pulse_width = 2400

#         self.servo_freq = 333

#         self.pitch_angle = 90
#         self.yaw_angle = 135

#     def __del__(self):
#         self._line_pitch.release() 
#         self._line_yaw.release() 

#     def initialise(self):
#         self._line_yaw.request(consumer='servo_control', type=gpiod.LINE_REQ_DIR_OUT)
#         self._line_pitch.request(consumer='servo_control', type=gpiod.LINE_REQ_DIR_OUT)


#         pitch_pwm_thread = threading.Thread(target=self.pitch_pwm_control)
#         pitch_pwm_thread.start()  
#         yaw_pwm_thread = threading.Thread(target=self.yaw_pwm_control)
#         yaw_pwm_thread.start()  
    
#     # def on_message_callback(self, data):
#     #     if data["message"] != self.data["message"]:
#     #         self.textScreen.add_message(data["message"])
#     #     self.data = data

#     def pitch_pwm_control(self):
#         pulse_width = self.pitch_angle / 270 * (self.servo_max_pulse_width - self.servo_min_pulse_width) + self.servo_min_pulse_width
#         while True:
#             self._line_pitch.set_value(1)
#             sleep(pulse_width/1000/1000)
#             self._line_pitch.set_value(0)
#             sleep(1/self.servo_freq - pulse_width/1000/1000)

#     def yaw_pwm_control(self):
#         pulse_width = self.yaw_angle / 270 * (self.servo_max_pulse_width - self.servo_min_pulse_width) + self.servo_min_pulse_width
#         while True:
#             self._line_yaw.set_value(1)
#             sleep(pulse_width/1000/1000)
#             self._line_yaw.set_value(0)
#             sleep(1/self.servo_freq - pulse_width/1000/1000)

#     def update(self):
#         self.pitch_angle = int(input("next angle"))

# cameragimbal = Gimbal()
# cameragimbal.initialise()
# while True:
#     cameragimbal.update()

from rpi_hardware_pwm import HardwarePWM
from time import sleep

freq = 333
pwm = HardwarePWM(pwm_channel=0, hz=freq, chip=2)
width_min = 544
width_max = 2400
angle = 90
width = angle/270 * (width_max - width_min) + width_min
pwm.change_frequency(freq)

pwm.start(width/(1/freq * 1000000)* 100) # full duty cycle
# pwm.change_duty_cycle(50)
sleep(2)
pwm.stop()
# from rpi_hardware_pwm import HardwarePWM

# pwm = HardwarePWM(pwm_channel=0, hz=60, chip=2)
# pwm.start(100) # full duty cycle

# pwm.change_duty_cycle(50)
# pwm.stop()

