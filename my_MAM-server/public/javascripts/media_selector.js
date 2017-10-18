$( document ).ready(function() {
    //console.log( "Jquery ready!" );
    $("img").click(function(){
        var id = $(this).attr("id");
        var url = '"/src/Thumbnails/'+id+'.png"'
        $("#my-player").attr("poster", "/src/Thumbnails/"+id+".png");
        $("#video_asset").attr("src", "src/Proxys/"+id+".mp4");
        $("#my-player_html5_api").attr("poster", "/src/Thumbnails/"+id+".png");
        $("#my-player_html5_api").attr("src", "src/Proxys/"+id+".mp4");
        $(".vjs-poster").attr("style", "background-image: url("+url+");");
    })
});

// <div class="vjs-poster" tabindex="-1" aria-disabled="false" style="background-image: url(&quot;/player/default.png&quot;);"></div>