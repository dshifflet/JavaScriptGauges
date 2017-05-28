# JavaScript Gauges
Gauge Visualization done in Javascript via the HTML5 Canvas.

## Example
(https://github.com/dshifflet/JavaScriptGauges/blob/master/gauge_example.png?raw=true)

## Setup
```javascript
			var flow = new gauge("FLOW",270,180,0,350,3, 
			  new gaugeTitle("STREAM FLOW", "GPH"),
			[ 
				new gaugeTick(50,1,15,true),
			  	new gaugeTick(25,1,10,false), 
			  	new gaugeTick(5,1,5,false) 
			],
			[
				new gaugeShade("green", 91,236,7),
				new gaugeShade("red", 236,350,7),
				new gaugeShade("white", 64,130,3)
			],
			[
				new gaugeNeedle("line", "blue", 95, 2, 150),
				new gaugeNeedle("pointy", "orange", 95, 2, 100)
			]);
			flow.paint();	
```

And in the HTML

```html
<div id="FLOW" style="height:300px;width:300px;background-color:black;color:white;position:absolute;z-index:5;top:0;left:5;"></div>
```