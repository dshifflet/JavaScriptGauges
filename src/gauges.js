var gauges = new function() {
	this.gauge = function(name, startArc, endArc, minValue, maxValue, lineWidth, title, ticks, shades, needles) {
		var isSetup = false;
		var self = this;
		
		this.name = name;
		this.startArc = startArc;
		this.endArc = endArc + startArc;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.ticks = ticks;
		this.background_canvas = {};
		this.foreground_canvas = {};
		this.lineWidth = lineWidth;
		this.title = title;
		this.resolution = (Math.abs(this.endArc - this.startArc) / 360 * 2 * Math.PI) / (this.maxValue - this.minValue);
		this.needles = needles;

		this.setup = function() {
			if(isSetup) return;

			var container = document.getElementById(name);
			var bgCanvas = document.createElement("canvas");
			bgCanvas.id = name + "_background";
			bgCanvas.width = container.offsetWidth;
			bgCanvas.height = container.offsetHeight;
			bgCanvas._foreGroundColor = container.style.color;
			bgCanvas._backGroundColor = container.style.backgroundColor;			
			
			var fgCanvas = document.createElement("canvas");
			fgCanvas.id = name + "_foreground";
			fgCanvas.width = container.offsetWidth;
			fgCanvas.height = container.offsetHeight;
			fgCanvas._foreGroundColor = container.style.color;
			fgCanvas._backGroundColor = container.style.backgroundColor;			
			
			self.background_canvas = bgCanvas;  
			self.foreground_canvas = fgCanvas;  
			
			container.appendChild(self.foreground_canvas);	
			container.appendChild(self.background_canvas);	

			self.drawBackGround(self.background_canvas.getContext("2d"));			
			isSetup = true; 	
		}

		this.drawBackGround = function(ctx) {
			//Draw the background			
			ctx.clearRect(0, 0, self.background_canvas.width, self.background_canvas.height);
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.strokeStyle = self.background_canvas._foreGroundColor;
			var sArc = this.startArc;
			var eArc = this.endArc;
			
			ctx.arc(
				ctx.canvas.offsetWidth / 2 ,
				ctx.canvas.offsetHeight  / 2,
				ctx.canvas.offsetHeight / 2 - 2,
				(sArc - 90) / 360 * 2 * Math.PI,
				(eArc - 90) / 360 * 2 * Math.PI
			);
			ctx.stroke();

			//draw the elements of the gauge...
			if(title) {
				title.paint(self, ctx);
			}

			if(shades){
				for(var i=0;i<shades.length;i++){
					shades[i].paint(self, ctx);
				}
			}
			
			if(ticks){
				for(var i=0;i<ticks.length;i++){
					ticks[i].paint(self, ctx);
				}
			}	
			self.background_canvas.style.display = "none";			
		};
		
		this.paint = function() {
			self.setup();       

			var ctx = self.background_canvas.getContext("2d");					
			var foregroundCtx = self.foreground_canvas.getContext('2d');
			
			foregroundCtx.clearRect(0, 0, foregroundCtx.canvas.width, foregroundCtx.canvas.height);
			foregroundCtx.drawImage(ctx.canvas, 0, 0);			
			
			if(needles){
				for(var i=0;i<needles.length;i++){
					needles[i].paint(self);
				}
			}
			foregroundCtx.stroke();
			ctx.stroke();
		}
		
		return this;
	};


	this.gaugeTitle = function(text1, text2){
		
		this.paint = function(input, ctx) {
			var h = ctx.canvas.offsetWidth / 2;
			var k = ctx.canvas.offsetHeight  / 2;
			var fontHeight1 = 40/500 * ctx.canvas.offsetWidth;
			var fontHeight2 = 30/500 * ctx.canvas.offsetWidth;					 
			ctx.fillStyle = input.background_canvas._foreGroundColor;					   
			ctx.font= fontHeight1 + "px Arial";
			var txtWidth1 = ctx.measureText(text1).width;         
			ctx.fillText(text1, h - txtWidth1 / 2, k - fontHeight1);
			ctx.font= fontHeight2 + "px Arial";
			var txtWidth2 = ctx.measureText(text2).width;    
			ctx.fillText(text2, h - txtWidth2 / 2, k + fontHeight2);
		}
		return this;
	}

	this.gaugeShade = function(color, start, end, widthPercent) {
		this.paint = function(input, ctx) {
			
			ctx.beginPath();     
			ctx.strokeStyle = color;
			ctx.lineWidth = widthPercent / 100 * ctx.canvas.offsetWidth / 2;   
			var h = ctx.canvas.offsetWidth / 2;
			var k = ctx.canvas.offsetHeight  / 2;
			var r = ctx.canvas.offsetHeight / 2 - ctx.lineWidth/2 - input.lineWidth/2;        
			var startAngle = start * input.resolution + (input.startArc - 90) / 360 * 2 * Math.PI;
			var endAngle = end * input.resolution + (input.startArc - 90) / 360 * 2 * Math.PI;
			
			ctx.arc(
				h,
				k,
				r,
				startAngle,
				endAngle                 
			);    
			ctx.stroke();
		}
		return this;
	}

	this.gaugeTick = function(increment, width, lengthPercent, hasLabel) {
		
		this.paint = function(input, ctx) {       

			for(var i=input.minValue;i<=input.maxValue;i++){
				if((i % increment) === 0) {
					startArc = input.startArc;

					ctx.strokeStyle = input.background_canvas._foreGroundColor;
					ctx.lineWidth = lengthPercent / 100 * input.background_canvas.offsetWidth / 2;
					ctx.beginPath();                                
					var h = ctx.canvas.offsetWidth / 2;
					var k = ctx.canvas.offsetHeight  / 2;
					var r = ctx.canvas.offsetHeight / 2 - ctx.lineWidth/2 + input.lineWidth / 2 - 2;                
					var angle = (i) * input.resolution + ((startArc - 90) / 360 * 2 * Math.PI);
					var startAngle = (i - width) * input.resolution + ((startArc - 90) / 360 * 2 * Math.PI);
					var endAngle = (i + width) * input.resolution + ((startArc - 90) / 360 * 2 * Math.PI);    
					ctx.arc(
						h,
						k,
						r,
						startAngle,
						endAngle                 
					);
					ctx.stroke();
					if(hasLabel){                                
						var ptX = (r - (lengthPercent + 5)/100 * r) * Math.cos(angle) + h;
						var ptY = (r - (lengthPercent + 5)/100 * r) * Math.sin(angle) + k;                    
						var fontHeight = 30/500 * ctx.canvas.offsetWidth;
						ctx.font= fontHeight + "px Arial";     
						ctx.fillStyle = input.background_canvas._foreGroundColor;
						var txtWidth = ctx.measureText(i).width;     

						if(!(input.startArc==0 && input.endArc==360) || angle<4.7){
							ctx.fillText(i, ptX - txtWidth / 2, ptY);
						}
					}                
				}
			}
		}
		return this;
	};

	this.gaugeNeedle = function(painter, color, lengthPercent, widthPercent, value) {
		this.value = value;
		this.gauge = {};
		var self = this;
		this.lengthPercent = lengthPercent;
		this.widthPercent = widthPercent;
		this.color = color;
		
		
		this.paint = function(input) {
			this.gauge = input;       
			var ctx = input.foreground_canvas.getContext("2d");
			ctx.strokeStyle = color;
			ctx.beginPath();                                

			var h = input.foreground_canvas.offsetWidth / 2;
			var k = input.foreground_canvas.offsetHeight  / 2;
			var r = input.foreground_canvas.offsetHeight / 2 - ctx.lineWidth/2 + input.lineWidth / 2 - 2;   
			
			var angle = self.value * input.resolution + ((input.startArc - 90) / 360 * 2 * Math.PI);        
			var lineWidth = widthPercent / 100 * input.foreground_canvas.offsetWidth / 2;		
			painter.paint(ctx, h, k, r, angle, lineWidth, this);
		}
		return this;		
	}

	this.needlePainters = new function() {	
		this.lineNeedle = function() {
			this.paint = function(ctx, h, k, r, angle, lineWidth, needle) {
				ctx.lineWidth = lineWidth;
				ctx.beginPath();
				var radius = (needle.lengthPercent)/100 * r;
				var ptX = radius * Math.cos(angle) + h;
				var ptY = radius * Math.sin(angle) + k;  

				var ptX0 = -.10 * r * Math.cos(angle) + h;
				var ptY0 = -.10 * r * Math.sin(angle) + k;  
				ctx.moveTo(ptX0,ptY0);			 
				ctx.lineTo(ptX, ptY);
				ctx.stroke();
			}
			return this;
		}

		this.pointyNeedle = function() {
			this.paint = function(ctx, h, k, r, angle, lineWidth, needle) {
				ctx.beginPath();
				
				var radius = (needle.lengthPercent)/100 * r;
				var width = (lineWidth/100)

				var ptX = radius * Math.cos(angle) + h;
				var ptY = radius * Math.sin(angle) + k;       
				
				var ptX0 = -.10 * r * Math.cos(angle) + h;
				var ptY0 = -.10 * r * Math.sin(angle) + k;

				var ptX1 = lineWidth * Math.cos(angle - Math.PI/2) + ptX0;
				var ptY1 = lineWidth * Math.sin(angle - Math.PI/2) + ptY0;
				var ptX2 = lineWidth * Math.cos(angle + Math.PI/2) + ptX0;
				var ptY2 = lineWidth * Math.sin(angle + Math.PI/2) + ptY0;
				ctx.lineWidth = 1;
				ctx.moveTo(ptX1, ptY1);                
				ctx.lineTo(ptX, ptY);        
				ctx.lineTo(ptX2, ptY2);
				ctx.lineTo(ptX1, ptY1);
				ctx.closePath();
				ctx.fillStyle = needle.color;
				ctx.fill();                    
				ctx.stroke();     
			}
			return this;
		}

		this.longPointyNeedle = function() {
			this.paint = function(ctx, h, k, r, angle, lineWidth, needle) {
				ctx.beginPath();
				var radius = (needle.lengthPercent)/100 * r;
				var width = (lineWidth/100)

				var ptX = radius * Math.cos(angle) + h;
				var ptY = radius * Math.sin(angle) + k;

				//base below center
				var ptXA = -.10 * r * Math.cos(angle) + h;
				var ptYA = -.10 * r * Math.sin(angle) + k;                          
				var ptX1A = lineWidth * Math.cos(angle - Math.PI/2) + ptXA;
				var ptY1A = lineWidth * Math.sin(angle - Math.PI/2) + ptYA;
				var ptX2A = lineWidth * Math.cos(angle + Math.PI/2) + ptXA;
				var ptY2A = lineWidth * Math.sin(angle + Math.PI/2) + ptYA;       

				//base above center

				var ptXB = (needle.lengthPercent/100) * .90 * r * Math.cos(angle) + h;
				var ptYB = (needle.lengthPercent/100)* .90 * r * Math.sin(angle) + k;                          
				var ptX1B = lineWidth * Math.cos(angle - Math.PI/2) + ptXB;
				var ptY1B = lineWidth * Math.sin(angle - Math.PI/2) + ptYB;
				var ptX2B = lineWidth * Math.cos(angle + Math.PI/2) + ptXB;
				var ptY2B = lineWidth * Math.sin(angle + Math.PI/2) + ptYB;

				ctx.lineWidth = 1;

				ctx.moveTo(ptX1A, ptY1A);
				ctx.moveTo(ptX1B, ptY1B);
				ctx.lineTo(ptX, ptY);        
				ctx.lineTo(ptX2B, ptY2B);
				ctx.lineTo(ptX2A, ptY2A);
				ctx.lineTo(ptX1A, ptY1A);
				ctx.closePath();
				ctx.fillStyle = needle.color;
				ctx.fill();                    
				ctx.stroke();
				//middle line
				ctx.beginPath();        
				ctx.strokeStyle = needle.gauge.background_canvas._backGroundColor;
				ctx.moveTo(ptXA,ptYA);
				ctx.lineTo(ptX, ptY);   
				ctx.stroke();        
			}
			return this;
		}

		this.markerNeedle = function() {
			this.paint = function(ctx, h, k, r, angle, lineWidth, needle) {
				ctx.beginPath();
				var radius = (needle.lengthPercent)/100 * r;
				var width = (lineWidth/100)

				var ptX = (radius) * Math.cos(angle) + h;
				var ptY = (radius) * Math.sin(angle) + k;
				
				var ptXA = (radius - lineWidth*(needle.widthPercent/100)) * Math.cos(angle) + h;
				var ptYA = (radius - lineWidth*(needle.widthPercent/100)) * Math.sin(angle) + k;                          
				var ptX1A = lineWidth*(needle.widthPercent/100) * Math.cos(angle - Math.PI/2) + ptXA;
				var ptY1A = lineWidth*(needle.widthPercent/100) * Math.sin(angle - Math.PI/2) + ptYA;
				var ptX2A = lineWidth*(needle.widthPercent/100) * Math.cos(angle + Math.PI/2) + ptXA;
				var ptY2A = lineWidth*(needle.widthPercent/100) * Math.sin(angle + Math.PI/2) + ptYA;    

				ctx.lineWidth = 1;   
				ctx.strokeStyle = needle.gauge.background_canvas._backGroundColor;
				ctx.moveTo(ptX1A, ptY1A);        
				ctx.lineTo(ptX, ptY);
				ctx.lineTo(ptX2A, ptY2A);                
				ctx.lineTo(ptX1A, ptY1A);
				ctx.closePath();
				ctx.fillStyle = needle.color;
				ctx.fill();                                    
				ctx.stroke();
			}
			return this;
		}
		return this;
	}
	return this;
}