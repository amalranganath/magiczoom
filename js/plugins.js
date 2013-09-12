(function ( $ ) {
    var PreviewObj = new Object;

    $.fn.magicZoom = function(options) {
        var settings = $.extend({
            activeThumb: 0
        }, options );

        var aThumb = this[settings.activeThumb];

        $('<div id=preview /><div id=zoom />').appendTo($('#magic_zoom'));

        return this.each(function() {
            if(this === aThumb) {
                PreviewObj.fileName = $(this).data( "zoomed" );
                $(this).addClass('active');
                createPreview();}

            $(this).on("click", function(event){
                PreviewObj.fileName = $(this).data( "zoomed" );
                $('.active').removeClass('active');
                $(this).addClass('active');
                $('#zoom').empty();
                $('.message').remove();
                createPreview();
            });
        });
    };

    function createPreview() {
        var url = 'img/vincentfoutnier/'+PreviewObj.fileName+'.jpg',
            previewImg = $('<img class=preview src="'+url+'">');
            previewImg.css('visibility','hidden');
        previewImg.appendTo($('#preview'));

        $(previewImg).one('load', function() {
            var w = this.width, h = this.height, mr = parseInt($('#magic_zoom ul').css('margin-right').replace("px", "")), off = $('#preview').offset().left;
            PreviewObj.previewImgW = w;
            PreviewObj.previewImgH = h;
            $('#preview').css({'width': w+mr, 'height' : h});
            $('#zoom').css({'width' : w , 'height' : h, 'left' : off + w + mr});
            initZoom();
            previewImg.css({'display':'none', 'visibility':'visible'});
            previewImg.fadeIn(function() { if($('.preview').length>1) {
                                            var el = $('.preview')[0];
                                            $(el).remove();
                                           };
                                        });
        }).each(function() {
            if(this.complete) $(this).load();
        }).error(function(){
            if($('.preview').length>0) {
                                            var el = $('.preview')[0];
                                            $(el).remove();
            } else {
                var w=400, h=50;
                $('#preview').css({'width': w, 'height':h});
                PreviewObj.previewImgW = w;
                PreviewObj.previewImgH = h;
            }

            displayMessage('failed to load '+url, '#c00');
        });
    };

    function initZoom() {
        
        var url = 'img/vincentfoutnier/zoom_'+PreviewObj.fileName+'.jpg',
            zoomImg = $('<img class ="zoom" src="'+url+'">');
        zoomImg.appendTo($('#zoom'));

        displayMessage('...load zoom...');
        
        $(zoomImg).one('load', function() {
            $('.message').remove();
            PreviewObj.zoomImgW = this.width;
            PreviewObj.zoomImgH = this.height;
            calcZoom();
        }).each(function() {
            if(this.complete) $(this).load();
        }).error(function(){
            displayMessage('...failed to load zoom...', '#c00');
        });

    };


    function displayMessage(msg, clr) {
        clr = typeof clr !== 'undefined' ? clr : '#000';
        var target= $('#preview');
        if($('.message').length>0) 
            $('.message').text('...failed to load zoom...'); 
        else 
            $('<div class=message>'+msg+'</div>').appendTo(target);
        
        $('.message').css({'width': PreviewObj.previewImgW, 'line-height':PreviewObj.previewImgH+'px', color:clr});

    }

    function calcZoom() {
        $(".preview").mousemove(function(event) {
            var x = event.pageX-$(this).offset().left,
                y = event.pageY-$(this).offset().top,
                zoomedX = -Math.round(x*(PreviewObj.zoomImgW-PreviewObj.previewImgW)/PreviewObj.previewImgW),
                zoomedY = -Math.round(y*(PreviewObj.zoomImgH-PreviewObj.previewImgH)/PreviewObj.previewImgH);
            $('.zoom').css({'left':zoomedX, 'top':zoomedY});
        });

        $(".preview").mousemove(function(event) {
            $('#zoom').css('visibility','visible');
        });

        $(".preview").mouseout(function(event) {
            $('#zoom').css('visibility','hidden');
        });
    }
}( jQuery ));

