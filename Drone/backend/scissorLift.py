import gpiod
from time import sleep

_LINE_IN1 = 23
_LINE_IN2 = 24

class ScissorLift():
    def __init__(self):
        self._chip = gpiod.Chip("gpiochip4")
        self._line1 = self._chip.get_line(_LINE_IN1)
        self._line2 = self._chip.get_line(_LINE_IN2)
        self.line1_value = 0
        self.line2_value = 0

        self._line1.request(consumer='scissor_lift_control', type=gpiod.LINE_REQ_DIR_OUT)
        self._line2.request(consumer='scissor_lift_control', type=gpiod.LINE_REQ_DIR_OUT)

    def update(self):
        self._line1.set_value(self.line1_value)
        self._line2.set_value(self.line2_value)

    def up(self):
        self.line1_value = 0
        self.line2_value = 1

    def down(self):
        self.line1_value = 1
        self.line2_value = 0

    def stop(self):
        self.line1_value = 0
        self.line2_value = 0

    def on_data_callback(self, data):
        if data["up"] and data["down"]:
            self.stop()
        elif data["up"]:
            self.up()
        elif data["down"]:
            self.down()
        else:
            self.stop()
