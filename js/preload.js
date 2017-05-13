(function(){
	var bgs = {
		'#home .bg': 'http://drive.google.com/uc?export=view&id=0B5PQjHqiZbvibmo2YktUSm5xTlU'
	};
	for(var selector in bgs)
	{
		var img = new Image();
		img.onload = function()
		{
			$(selector).css('opacity', 1);
		};
		img.src = bgs[selector];
	}
})();