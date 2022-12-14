# Puck.js Temperature and Accelerometer

Just playing around with [Puck.js](https://www.puck-js.com/). This snippet
includes two apps:

* Single press => Displays the current temperature.
  * Colors:
    * Red = hot
    * Yellow = normal
    * Blue = cold
  * Temperature detector doesn't seem very accurate to ambient temperature, but
    works as a proof of concept.
* Double press => Displays the current accelerometer status.
  * Colors:
    * Red = stationery
    * Green = moving

Either app can be stopped with a simple press. Afterwards the device is
effectively disabled and the next press / double press will start one of the
above apps.

The device should probably clean up all the listeners and should be pretty
memory efficient. Leaving it in the disabled state for a long time should be
viable without killing the battery, but I haven't tested it.
