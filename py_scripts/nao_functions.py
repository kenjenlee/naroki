from __future__ import print_function
from naoqi import ALProxy

def speak(speech):
    tts = ALProxy("ALTextToSpeech", '192.168.1.129', 9559)
    tts.say(str(speech))