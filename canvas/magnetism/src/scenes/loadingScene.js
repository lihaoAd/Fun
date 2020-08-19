var LoadingScene = function(game, stage)
{
  var self = this;

  var dc = stage.drawCanv;
  var canvas = dc.canvas;
  var ctx = dc.context;

  var allow_play;

  var pad;
  var barw;

  var loading_percent_loaded;
  var ticks_since_loading_ready;
  var percent_loaded;
  var chase_percent_loaded;
  var lerp_percent_loaded;
  var lerp_chase_percent_loaded;
  var ticks_since_ready;
  var post_load_countdown;

  var n_loading_imgs_loaded;
  var loading_img_srcs;
  var loading_imgs;
  var n_imgs_loaded;
  var img_srcs;
  var imgs;

  var loadingImageLoaded = function()
  {
    n_loading_imgs_loaded++;
  };
  var imageLoaded = function()
  {
    n_imgs_loaded++;
  };

  self.ready = function()
  {
    allow_play = true;

    pad = 20;
    barw = (dc.width-(2*pad));

    loading_percent_loaded = 0;
    ticks_since_loading_ready = 0;
    percent_loaded = 0;
    chase_percent_loaded = 0;
    lerp_percent_loaded = 0;
    lerp_chase_percent_loaded = 0;
    ticks_since_ready = 0;
    post_load_countdown = 200;

    n_loading_imgs_loaded = 0;
    loading_img_srcs = [];
    loading_imgs = [];
    n_imgs_loaded = 0;
    img_srcs = [];
    imgs = [];

    ctx.font = "12px Open Sans"; //put font that nees loading here
    ctx.fillStyle = "#000000";
    ctx.fillText(".",0,0);// funky way to encourage any custom font to load

    //put asset paths in loading_img_srcs (for assets used on loading screen itself)
    loading_img_srcs.push("assets/loading/experiment.png");
    loading_img_srcs.push("assets/loading/clouds.png");
    loading_img_srcs.push("assets/loading/flag.png");
    loading_img_srcs.push("assets/loading/logo.png");
    loading_img_srcs.push("assets/loading/pole.png");
    for(var i = 0; i < loading_img_srcs.length; i++)
    {
      loading_imgs[i] = new Image();
      loading_imgs[i].onload = loadingImageLoaded;
      loading_imgs[i].src = loading_img_srcs[i];
    }
    loadingImageLoaded(); //call once to prevent 0/0 != 100% bug

    img_srcs.push("assets/mag_n.png");
    img_srcs.push("assets/mag_s.png");
    img_srcs.push("assets/pin_n.png");
    img_srcs.push("assets/pin_s.png");
    img_srcs.push("assets/mag_red.png");
    img_srcs.push("assets/mag_blue.png");
    img_srcs.push("assets/compass.png");
    img_srcs.push("assets/compass_dot.png");
    img_srcs.push("assets/compass_drop.png");
    img_srcs.push("assets/needle.png");
    img_srcs.push("assets/iron_filings.png");
    img_srcs.push("assets/iron_filings_dot.png");
    img_srcs.push("assets/iron_filings_drop.png");
    img_srcs.push("assets/mag_film.png");
    img_srcs.push("assets/mag_film_dot.png");
    img_srcs.push("assets/mag_film_drop.png");
    img_srcs.push("assets/sidebar_tools.png");
    img_srcs.push("assets/sidebar_guess.png");
    img_srcs.push("assets/guess_lbl.png");
    img_srcs.push("assets/tools_lbl.png");
    img_srcs.push("assets/guess_btn.png");
    img_srcs.push("assets/scout.png");
    img_srcs.push("assets/bg_0.png");
    img_srcs.push("assets/bg_1.png");
    img_srcs.push("assets/bg_2.png");
    img_srcs.push("assets/junk_0.png");
    img_srcs.push("assets/junk_1.png");
    img_srcs.push("assets/junk_2.png");
    img_srcs.push("assets/junk_3.png");
    img_srcs.push("assets/junk_4.png");
    img_srcs.push("assets/junk_big_0.png");
    img_srcs.push("assets/junk_big_1.png");
    img_srcs.push("assets/btn_game.png");
    img_srcs.push("assets/btn_playground.png");
    img_srcs.push("assets/btn_tutorial.png");
    img_srcs.push("assets/comic.png");
    img_srcs.push("assets/menu/menu_gradient.png");
    img_srcs.push("assets/menu/menu_logo.png");
    img_srcs.push("assets/star-empty.png");
    img_srcs.push("assets/star-filled.png");
    for(var i = 0; i < 7; i++)
      img_srcs.push("assets/chars/face/char_"+i+".png");
    for(var i = 0; i < 3; i++)
      img_srcs.push("assets/comic/comic_"+i+".png");
    for(var i = 0; i < img_srcs.length; i++)
    {
      imgs[i] = new Image();
      imgs[i].onload = imageLoaded;
      imgs[i].src = img_srcs[i];
    }
    imageLoaded(); //call once to prevent 0/0 != 100% bug
  };

  self.tick = function()
  {
    var buffer = 40;
    var old_allow_play = allow_play;
    var w = window.screen.width;
    var h = window.screen.height;
    if(
      (w > h && (w < 880+buffer || h < 660+buffer)) ||
      (h > w && (h < 880+buffer || w < 660+buffer))
    )
      allow_play = false;
    else allow_play = true;
    if(old_allow_play && !allow_play)
    {
      var sc = document.getElementById("stage_container");
      var content = document.getElementById("BrainPOPsnapArea");
      sc.style.display = "flex";
      sc.style.flexDirection = "column";
      sc.style.justifyContent = "center";
      sc.style.alignItems = "center";
      sc.style.backgroundColor = "#15A9CB";
      sc.innerHTML = "<img width='300' src='assets/loading/logo.png'></img><div style='font-family:Open Sans; font-size:16px; color:#FFFFFF; padding:20px; text-align:center;'>Sorry!<br />Game requires screen size<br />of at least "+(880+buffer)+"x"+(660+buffer)+" pixels.<br />(Your screen size is "+window.screen.width+"x"+window.screen.height+")<br />Try playing on a desktop, laptop, or tablet!</div>";
    }

    //note- assets used on loading screen itself NOT included in wait
    loading_percent_loaded = n_loading_imgs_loaded/(loading_img_srcs.length+1);
    if(loading_percent_loaded >= 1.0) ticks_since_loading_ready++;
    percent_loaded = n_imgs_loaded/(img_srcs.length+1);
    if(chase_percent_loaded <= percent_loaded) chase_percent_loaded += 0.01;
    lerp_percent_loaded = lerp(lerp_percent_loaded,percent_loaded,0.1);
    lerp_chase_percent_loaded = lerp(lerp_chase_percent_loaded,chase_percent_loaded,0.1);
    if(percent_loaded >= 1.0) ticks_since_ready++;
    if(ticks_since_ready >= post_load_countdown && allow_play)
    {
      bake();
      game.nextScene();
    }
  };

  self.draw = function()
  {
    var pole_x = 100;
    var pole_w = 68/2;
    var pole_h = 1158/2;

    ctx.fillStyle = "#15A9CB"; //blue
    ctx.fillRect(0,0,dc.width,dc.height);

    if(allow_play)
    {
      if(loading_percent_loaded >= 1)
      {
        //do any special drawing here
        var a = ticks_since_loading_ready/20;
        if(a > 1) a = 1;
        ctx.globalAlpha = a;

        //continue to draw underlying bar during fade in
        ctx.fillStyle = "#EFC72F"; //yellow
        ctx.fillRect(pole_x+15,dc.height-pole_h*lerp_percent_loaded,pole_w-30,pole_h);

        var w;
        var h;
        w = 1540*3/4;
        h = 564*3/4;
        ctx.drawImage(loading_imgs[1],-w+(ticks_since_loading_ready%w),0,w,h); //clouds
        ctx.drawImage(loading_imgs[1],(ticks_since_loading_ready%w),0,w,h); //clouds
        w = pole_w;
        h = pole_h;
        ctx.drawImage(loading_imgs[4],pole_x,dc.height-h,w,h); //pole
        w = 280;
        h = 122;
        ctx.drawImage(loading_imgs[2],pole_x+pole_w-20,dc.height-(pole_h-50)*lerp_percent_loaded,w,h); //flag

        var n = 170;
        if(ticks_since_ready > post_load_countdown-n)
        {
          f = (ticks_since_ready-(post_load_countdown-n))/50;
          if(f < 0) f = 0;
          if(f > 1) f = 1;
          ctx.globalAlpha = f;
          w = 640/2;
          h = 118/2;
          ctx.drawImage(loading_imgs[3],240,260+20,w,h);
          w = 534/1.5;
          h = 22/1.5;
          ctx.drawImage(loading_imgs[0],240,260+100,w,h);
        }
        ctx.globalAlpha = 1;

        var n = 20;
        if(ticks_since_ready > post_load_countdown-n)
        {
          f = (ticks_since_ready-(post_load_countdown-n))/n;
          if(f > 1) f = 1;
          if(f < 0) f = 0;
          ctx.globalAlpha = f;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0,0,dc.width,dc.height);
        }
        ctx.globalAlpha = 1;
      }
      else
      {
        ctx.fillStyle = "#EFC72F"; //yellow
        ctx.fillRect(pole_x+25,dc.height-pole_h*lerp_chase_percent_loaded,pole_w-50,pole_h);
      }
    }
    else
    {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "30px Open Sans";
      ctx.textAlign = "center";
      //single
      var x = 440;
      var y = 330;
      var w = 640/2;
      var h = 118/2;
      ctx.drawImage(loading_imgs[3],x-w/2,y-h/2-50,w,h); //logo
      ctx.fillText("Game requires larger screen!",x,y+50);
      ctx.fillText("Sorry!",x,y+50+40);

      ctx.font = "12px Open Sans";
      ctx.textAlign = "left";
      x = 10;
      y = 20
      ctx.fillText("Game requires screen size of at least 880x660 pixels.",x,y);
      ctx.fillText("Try playing on a desktop, laptop, or tablet!",x,y+20);
    }

  };

  self.cleanup = function()
  {
    imgs = [];//just used them to cache assets in browser; let garbage collector handle 'em.
    loading_imgs = [];//just used them to cache assets in browser; let garbage collector handle 'em.
  };
};

