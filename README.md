# JavaScript Gauges
Gauge Visualization done in Javascript via the HTML5 Canvas.

## Example
![alt text](https://github.com/dshifflet/JavaScriptGauges/blob/master/gauge_example.png "Example Gauge")

## Setup
```javascript
			var flow = new gauges.gauge("FLOW",270,180,0,350,3, 
			  new gauges.gaugeTitle("STREAM FLOW", "GPH"),
			[ 
				new gauges.gaugeTick(50,1,15,true),
			  	new gauges.gaugeTick(25,1,10,false), 
			  	new gauges.gaugeTick(5,1,5,false) 
			],
			[
				new gauges.gaugeShade("green", 91,236,7),
				new gauges.gaugeShade("red", 236,350,7),
				new gauges.gaugeShade("white", 64,130,3)
			],
			[
				new gauges.gaugeNeedle(new gauges.needlePainters.lineNeedle(), "blue", 95, 2, 0),
				new gauges.gaugeNeedle(new gauges.needlePainters.pointyNeedle(), "orange", 95, 2, 10)
			]);
			flow.paint();	
```

And in the HTML

```html
<div id="FLOW" style="height:300px;width:300px;background-color:black;color:white;position:absolute;z-index:5;top:0;left:5;"></div>
```