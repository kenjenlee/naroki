from __future__ import print_function
from naoqi import ALProxy

def speak(speech):
    tts = ALProxy("ALTextToSpeech", '169.254.39.230', 9559) # 192.168.1.129
    tts.say(str(speech))