window.addEvent('domready', function() {
	var pre	=	new Image();
	pre.src	=	'images/ncta.png';

	start_rain.delay(200);
});

start_rain = function()
{
	var _rain	=	new rain('rain', 'images/ncta.png', .4, 100);
}

var rain	=	new Class({
	container:	null,
	coords:		null,

	drops:		[],
	pool:       [],

	options: {
		image_url:	null,
		delay:		null,
		amount:		.7,
		speed:		7000
	},

	initialize: function(container, image_url, amount, delay)
	{
		this.container	=	$(container);
		if(!this.container) return false;

		var delay	=	parseInt(delay) >=0 ? delay : 0;
		var amount	=	parseFloat(amount) < 0 || parseFloat(amount) > 1 ? .2 : amount;

		this.options.image_url	=	image_url;
		this.options.delay		=	delay;
		this.options.amount		=	amount;

		this.rain();
	},

	rain: function()
	{
		if(Math.random() < this.options.amount)
		{
			this.add_drop();
		}

		var now = Date.now();
		for(var i = this.drops.length - 1; i >= 0; i--)
		{
			if(this.drops[i].expiration < now)
			{
				this.remove_drop(i);
			}
		}

		this.rain.delay(this.options.delay, this);
	},

	add_drop: function()
	{
		var img		=	this.pool.pop() || new Image();
		img.src		=	this.options.image_url;

		img.savedWidth  = img.savedWidth || img.width;
		img.savedHeight = img.savedHeight || img.height;

		var width	=	img.savedWidth;
		var height	=	img.savedHeight;
		img.prop	=	width / height;

		img.height	=	parseInt(((Math.random() * .8) + .2) * height);
		img.width	=	img.height * img.prop;

		img.size	=	parseInt(100 * ((img.width / width)));
		img.inv		=	parseInt(100 * (1 - (img.width / width)));

		var bottom	=	-(img.height + 10);

		this.coords	=	this.container.getCoordinates();

		var left	=	Math.floor(Math.random() * (this.coords.width - img.width));
		if(left + img.width > this.coords.right)
		{
			left	=	this.coords.right - img.height;
		}

		img.setStyles({
			bottom: -img.height+'px',
			left:	left + 'px',
			transform: 'translate(0, 0) rotate(0deg)',
			zIndex:	img.size
		});

		img.inject(this.container, 'bottom');

		var duration	=	this.options.speed;
		duration		+=	(img.inv / 100) * 4 * duration;
		var rotate = Math.floor(Math.random() * (1500 - 360 + 1)) + 360;
		var yfloat = Math.floor(Math.random() * (100 - (-100) + 1)) + (-100);
		yfloat = 0;

		img.style.transition = 'all ' + (duration / 1000) + 's linear';
		this.reflow(img);
		img.style.transform  = 'translate(' + yfloat + 'px, -'+(this.coords.height+img.height)+'px) rotate(-'+rotate+'deg)';
		img.expiration = Date.now() + duration + 100;

		this.drops.push(img);
	},

	reflow: function(node)
	{
		return node.offsetHeight;
	},

	remove_drop: function(index)
	{
		this.pool.push(this.drops[index]);
		this.drops[index].destroy();
		this.drops.splice(index, 1);
	}
});
