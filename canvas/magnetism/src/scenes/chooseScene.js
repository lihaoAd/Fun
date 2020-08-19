var ChooseScene = function(game, stage)
{
  var self = this;

  var dc = stage.drawCanv;
  var ctx = dc.context;

  var clicker;

  var btn_tut;
  var btn_game;
  var btn_playground;

  var btn_s;
  var btn_y;
  var btn_x;

  var section_line_y;
  var title_y;

  self.ready = function()
  {
    clicker = new Clicker({source:stage.dispCanv.canvas});

    var n_x_btns = 5;
    section_line_y = 278/2+10;
    btn_s = dc.width/(n_x_btns+2);
    btn_y = section_line_y+(dc.height-section_line_y)/2-btn_s/2;
    btn_x = [];
    for(var i = 0; i < n_x_btns; i++)
      btn_x[i] = btn_s/2+ ( btn_s+ (btn_s/(n_x_btns-1)))*i;

    title_y = dc.height/2-30;

    btn_tut        = new ButtonBox(btn_x[1],btn_y,btn_s,btn_s,function(evt){ game.start = 0; game.setScene(4); }); btn_tut.img = btn_tutorial_img;          clicker.register(btn_tut);
    btn_game       = new ButtonBox(btn_x[3],btn_y,btn_s,btn_s,function(evt){ game.start = 2; game.setScene(4); }); btn_game.img = btn_game_img;             clicker.register(btn_game);
    btn_playground = new ButtonBox(btn_x[2],btn_y,btn_s,btn_s,function(evt){ game.start = 1; game.setScene(4); }); btn_playground.img = btn_playground_img; clicker.register(btn_playground);
  };

  self.tick = function()
  {
    clicker.flush();
  };

  var space = String.fromCharCode(8202)+String.fromCharCode(8202);
  self.draw = function()
  {
    ctx.drawImage(comic_img,0,0,dc.width,dc.height);
    ctx.drawImage(menu_grad_img,0,0,dc.width,dc.height);
    var w = 324/2;
    var h = 278/2;
    ctx.drawImage(menu_logo_img,30,section_line_y-h,w,h);

    ctx.lineWidth = 10;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    dc.drawLine(0,section_line_y,dc.width,section_line_y);
    ctx.textAlign = "right";
    ctx.font = "60px SueEllen";
    ctx.fillText("Magnet Hunt!".split("").join(space+space),dc.width-20,section_line_y-40);

    ctx.textAlign = "center";
    ctx.font = "20px Open Sans";

    rectBtn(btn_tut,"Tutorial");
    rectBtn(btn_game,"Game");
    rectBtn(btn_playground,"Playground");
  };
  var rectBtn = function(btn,lbl)
  {
    ctx.fillStyle = "#FFFFFF";
  /*
    ctx.fillStyle = "#FFFFFF";
    dc.fillRoundRect(btn.x,btn.y,btn.w,btn.h,5);
    ctx.strokeStyle = "#000000";
    dc.strokeRoundRect(btn.x,btn.y,btn.w,btn.h,5);
  */
    ctx.drawImage(btn.img,btn.x,btn.y,btn.w,btn.h);
    ctx.fillText(lbl,btn.x+btn.w/2,btn.y+btn.h+20);
  }

  self.cleanup = function()
  {
    clicker.detach();
    clicker = undefined;
  };
};

