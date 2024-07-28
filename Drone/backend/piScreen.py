from luma.core.interface.serial import i2c
from luma.core.render import canvas
from luma.oled.device import sh1106
from time import sleep

MAX_CHAR_COUNT = 13
MAX_ROW_COUNT = 6
CHAR_HEIGHT = 10

class PiScreen():
    def __init__(self):
        serial = i2c(port=1, address=0x3C)
        self.device = sh1106(serial, rotate=0)
        
        self.messages = [""] * MAX_ROW_COUNT
        self.messagesCount = 0
        self.newestMessageIndex = 0

    def update(self):
        with canvas(self.device) as draw:
            self.draw_message(draw)
    
    def add_message(self, message):
        rowNeeded = int(len(message)/(MAX_CHAR_COUNT + 1)) + 1
        stepNeedToBeMoved = self.messagesCount + rowNeeded - MAX_ROW_COUNT
        index = 0
        if (stepNeedToBeMoved > 0):
            while index < self.messagesCount:
                newIndex = index - stepNeedToBeMoved
                if newIndex >= 0:
                    self.messages[newIndex] = self.messages[index]
                index += 1
            index = MAX_ROW_COUNT - 2 - stepNeedToBeMoved
        else:
            index = self.messagesCount
        
        self.newestMessageIndex = index
        while (index < MAX_ROW_COUNT and message != ""):
            self.messages[index] = message[:MAX_CHAR_COUNT]
            message = message[MAX_CHAR_COUNT:]
            index += 1
        
        self.messagesCount = 0
        for message in self.messages:
            if message != "":
                self.messagesCount += 1
            
    def draw_message(self,draw):
        delta = 0
        for index in range(0, MAX_ROW_COUNT):
            if index == self.newestMessageIndex:
                delta = 2
                draw.line((0, index * CHAR_HEIGHT, 130, index * CHAR_HEIGHT), fill="white", width=1)
            draw.text((0, index * CHAR_HEIGHT + delta), self.messages[index], fill="white")
            
