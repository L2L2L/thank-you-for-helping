
//I pack everything into an JSON object to make this more easy for you, and left in my trials:
var mapToSpriteSheet, img = new Image, ctx = document.body.querySelector('#cvs').getContext('2d');
img.src = './imgTimeTextSS.png';
xhrPost({method:'GET',
   url:'./maptoTimeSS.json',
   cb:function (status,readyState,response){
     mapToSpriteSheet = JSON.parse(response);
     console.log(status,readyState,response);
     imageText3(ctx,mapToSpriteSheet.tempSprite,mapToSpriteSheet,img);
   }
});

function imageText3(ctx,self,storage,source){
  debugger;
  var width = 0, i = 0, char, arr = ''+self.symbol, len = self.symbol.length, l,start, x, y,
      altrX = 0, altrY = 0,  halfWidth, ltr, bp = storage.bpText//{symbol:'',font:'',color:''};//bp = JSON.parse(Object.keys(storage)[0]);//bank.bpText;
	bp.font = ctx.font = self.font, offsetX = 0, offsetY = 2;
  bp.color = self.color;
  x = self.x, y = self.y;
	//width = ctx.measureText(self.symbol).width;
	//halfWidth = width/2;
	//ltr = width/len;
	//start = self.width/2+x;
  while (i < len){
    bp.symbol = isNaN(self.symbol[i])?(altrY=0,altrX=0,self.symbol[i]):(+self.symbol[i]);
    l =  storage[JSON.stringify(bp)];
    width += l.width;
    i++;
  }
  start = ((self.width/2)-(width/2))+self.x;
  ltr = width/len;
  i = 0;
//  if (!imageText2.loop)
//  imageText2.loop = () => {
    while (i < len) {
      bp.symbol = (self.symbol[i] === ' '||isNaN(self.symbol[i]))?(altrY=0,altrX=0,self.symbol[i]):(+self.symbol[i]);
      l =  storage[JSON.stringify(bp)];//<=getting key
      //console.log(l);
      //canvasDebug({x:x*i,y:y,o:l,ctx:ctx});
	    ctx.drawImage(source,
		    l.x,l.y,l.width,l.height,
        //(self.width/2+self.x-(l.width*i)),
        //(x+=l.width),
        !i?start:(start+=ltr),//l.width),//+(bp.symbol === ':'?9:0),//(self.width/2+self.x-(l.width*i)),
        //(x+=(i?ltr:i))+altrX+offsetX,
        //y+altrY+offsetY,
  //      y-l.height/2,
        ((self.height/2)-(l.height/2))+self.y,
        l.width,l.height);
        altrY=altrX=0,i++;
	  }
//};
  //else imageText2.loop();
}

function xhrPost(obj,cb){
  var incr = 0, url = obj.url, method = obj.method,
      json = obj.json, header, len; cb = cb||obj.cb;
  if (header) header = obj.header, len = header.length;
  var xhr = new XMLHttpRequest;
  xhr.onloadend = ()=>{console.log(xhr.status,xhr.readyState,xhr.response);
                       cb.call(xhr,xhr.status,xhr.readyState,xhr.response);};
  xhr.open(method,url,true);
  while (header&&(incr < len)) {xhr.setRequestHeader(...header[incr++]);}
  xhr.send(json);
}