# Hello Octave

A simple example showing how to subscribe to events that are arriving on an
Octave stream. This is a simple proof of concept and isn't meant to be reference
code. There is very little error checking in the code.

## Usage
1. `cp config-template.js config.js`
1. Edit `config.js` and fill in the config values based on your Octave settings
1. `docker build -t 'hello_docker:1.0' .`
1. `docker run --rm 'hello_docker:1.0'`
1. Observe that a websocket connection is established and light sensor readings
   are printed to the console
1. `docker ps`
1. `docker stop <CONTAINER_ID>`
