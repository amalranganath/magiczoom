$(function(){
    $( '.magic_zoom').magicZoom({
			activeThumb: 2,
			thumpPosition:"HB"
	});
	
	var opts = $('.opt'), opt;

	for (var i = 0; i < opts.length; i++) {
		opt = opts[i];
		if( $( opt ).find('em').text() == "HB") $( opt ).addClass('active');
	}


	$('.opt').on( "click", function() {
		var thumbs =  $('#list').find("img"), thumbPos = $( this ).find('em').text();
		$( '.magic_zoom').empty();
    	thumbs.appendTo( '.magic_zoom');

		$( this ).parent().find('.active').removeClass('active');
		$( this ).addClass('active');

    	$( '.magic_zoom').magicZoom({
			activeThumb: 1,
			thumpPosition: thumbPos
		});


	});
});
