# Kiki's Delivery
## NUS SoC Orbital 2024 Project

## Components
Client Side React Native based Web/Mobile App \
Client Side Controller Web App \
Drone Side Controller Web App + Python Code 

## Client Side React Native based Web/Mobile App
The framework used is React Native. \
The app is planned to be deployed on Web, Android and IOS. \
This is the app where users can authenticate, get information on the product, make payments, and receive code to activate their connection to the robot.

## Client Side Controller Web App
HTML, CSS and Js is used. \
This is the app that users use to control the robot.  
Requires code from the other app to connect to the robot. \

## Drone Side Controller Web App + Python Code 
HTML, CSS and Js is used for the Web App portion. \
Python scripting is used with Raspberry Pi GPIO to control the robot's hardware. \
Web App connects to user controller app with two-way video channel and one-way data channel. \
Information from data-channel is translated into control instructions.
