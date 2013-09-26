(function ( $ ) {
    var PreviewObj = new Object,
        Settings = new Object,
        path,
        coord = new Array,
        spacing = 5, widthMax = 0,
        stop_timeout = false,
        container, size, interval, zoomedX, zoomedY;

    $.fn.magicZoom = function(options) {
        var settings = $.extend({
            activeThumb:    0, 
            thumpPosition:  "VR"
        }, options );

        var aThumb = this[settings.activeThumb], widthAll = new Array(), imgs;

        container = this;

        imgs = $(this).find("img");
        aThumb = imgs[settings.activeThumb];

        imgs.each(function() {widthAll.push(this.width); $(this).css('cursor', 'pointer'); });
        
        widthMax = Math.max.apply(Math, widthAll);

        $(imgs).remove();

        Settings = settings;

        init(imgs);
    
        return imgs.each(function() {
            
            
            if(this === aThumb) {
                PreviewObj.previewName = $(this).data( "preview" );
                PreviewObj.zoomName = $(this).data( "zoomed" );
                $(this).css('box-shadow', '0 2px 3px 0 rgba(0, 0, 0, 0.5)');
                createPreview();
            }

            $(this).on("click", function(event){
                PreviewObj.previewName = $(this).data( "preview" );
                PreviewObj.zoomName = $(this).data( "zoomed" );
                $(imgs).css('box-shadow', '0 1px 2px 0 rgba(0, 0, 0, 0.3)');
                $(this).css('box-shadow', '0 2px 3px 0 rgba(0, 0, 0, 0.5)');
                $('#zoom').empty();
                $('.message').remove();
                createPreview();
            });
        });
    }

    function init(imgs) {

        path = ($(imgs[0]).attr('src')).split('/').reverse().slice(1).reverse().join('/');

        if (Settings.thumpPosition == "VR" || Settings.thumpPosition == "VRB") {
            $('<div id=list /><div id=preview /><div id=zoom />').appendTo($(container));
            $('#list').css({'width':widthMax+2*spacing, 'float':'left'});
            $('#preview').css('float','left');
        } else if (Settings.thumpPosition == "HB") {
            $('<div id=preview /><div id=list /><div id=zoom />').appendTo($(container));
        } else if (Settings.thumpPosition == "HT" || Settings.thumpPosition == "HTB") {
            $('<div id=list /><div id=preview /><div id=zoom />').appendTo($(container));
        }

        $('#preview').css('box-shadow', '0 1px 2px 0 rgba(0, 0, 0, 0.3)');
        
        $('#zoom').css({'position': 'absolute', 'visibility': 'hidden', 'overflow': 'hidden', 'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.3)'});

        
        $(imgs).appendTo($('#list'));


        
//#list img.active { box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.5);}
        
        if(Settings.thumpPosition == "VR" || Settings.thumpPosition == "VRB") 
            $(imgs).css({'display':'block', 'margin': '0 '+2*spacing+'px '+spacing+'px 0', 'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.3)'});
        else if (Settings.thumpPosition == "HB") 
            $(imgs).css({'display':'inline','margin': spacing+'px '+spacing+'px  '+2*spacing+'px 0', 'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.3)'});
        else if (Settings.thumpPosition == "HT" || Settings.thumpPosition == "HTB")
            $(imgs).css({'display':'inline','margin': '0 '+spacing+'px '+spacing+'px 0', 'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.3)'});

    }

    function createPreview() {
        var url = path+'/'+PreviewObj.previewName,
            previewImg = $('<img class=preview src="'+url+'">');
            previewImg.css({'position': 'absolute','visibility':'hidden'});
        previewImg.appendTo($('#preview'));

        $(previewImg).one('load', function() {
            var w = this.width, h = this.height, offLeft = $('#preview').offset().left, offTop = $('#preview').offset().top;
            PreviewObj.previewImgW = w;
            PreviewObj.previewImgH = h;
            $('#preview').css({'width': w, 'height' : h});
            if(Settings.thumpPosition == "VRB" || Settings.thumpPosition == "HTB") 
                $('#zoom').css({'width' : w , 'height' : h, 'left' : offLeft, 'top' : offTop+h + 2*spacing});
            else 
                $('#zoom').css({'width' : w , 'height' : h, 'left' : offLeft + w + 2*spacing, 'top': offTop});
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
        
        var url = path+'/'+PreviewObj.zoomName,
            zoomImg = $('<img class ="zoom" src="'+url+'">');
        zoomImg.appendTo($('#zoom'));
        zoomImg.css('position', 'absolute');

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

        if($('.message').length>0) {
            $('.message').text('...failed to load zoom...'); 
        } else {
            $('<div class=message>'+msg+'</div>').appendTo(target);
            $('.message').css({'position': 'absolute', 'margin': '0', 'text-align': 'center', 'vertical-align': 'middle'});
        }
        
        $('.message').css({'width': PreviewObj.previewImgW, 'line-height':PreviewObj.previewImgH+'px', color:clr});

    }

    function calcZoom() {
        $(".preview").mousemove(function(event) {
            var x = event.pageX-$(this).offset().left,
                y = event.pageY-$(this).offset().top, 
                dx, dy;
                zoomedX = -Math.round(x*(PreviewObj.zoomImgW-PreviewObj.previewImgW)/PreviewObj.previewImgW),
                zoomedY = -Math.round(y*(PreviewObj.zoomImgH-PreviewObj.previewImgH)/PreviewObj.previewImgH);
            $('.zoom').css({ left: zoomedX, top: zoomedY });
            //$('.zoom').animate({ left: zoomedX, top: zoomedY }, 1);
            //TweenLite.to($('.zoom'), 0.2, { css: { left: zoomedX, top: zoomedY }});

        });

        $(".preview").mouseover(function(event) {
            $('#zoom').css('visibility','visible');
        });

        $(".preview").mouseout(function(event) {
            $('#zoom').css('visibility','hidden');
        });

    function moveTo(dx, dy) {

        
        $('.zoom').css({'left':$('.zoom').offset().left+dx, 'top':$('.zoom').offset().top+dy});

        if( Math.abs($('.zoom').offset().left - zoomedX) < 1 && Math.abs( $('.zoom').offset().top - zoomedY) < 1) clearInterval(interval);
    }


    }
}( jQuery ));

