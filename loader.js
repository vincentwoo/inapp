var initLoader = function() {
  var colorIndex = -1;
  var colors = ["red", "yellow", "green", "blue"];
  var currentColor = "initial";
  var loader = document.getElementById("loader");
  var isInitOffline = false;
  
  
  if(loader) {
    
    isInitOffline = loader.className.indexOf('offline') !== -1;
    if(isInitOffline){ currentColor = " transitionOn" }
    
    loader.className = currentColor;
    
    if(loader.className.indexOf('transitionOn') !== -1){
      return;
    }
    
    var iv = setInterval(function() {
      
      var isTransOff = loader.className.indexOf('readyOff') !== -1 ? ' transitionOff' : '';
      var isTransOn = loader.className.indexOf('readyOn') !== -1 ? ' transitionOn' : '';
      var isOffline = loader.className.indexOf('transitionOff') !== -1 && !isTransOn ? ' offline' : '';
      var isStopping = loader.className.indexOf('stopping') !== -1 ? ' stopped' : '';
      var isFinishing = loader.className.indexOf('stopped') !== -1 ? ' finishing' : '';
            
      colorIndex = isFinishing === '' ? (colorIndex+1)%colors.length : (colorIndex)%colors.length;
      loader.className = colors[colorIndex] + isTransOff + isTransOn + isOffline + isStopping + isFinishing;
      !!(currentColor === "initial") && (loader.className += " firstTime");
      
      if(loader.className.indexOf('offline') !== -1){
        clearInterval(iv);
      }
      if(isFinishing !== ' finishing'){ //stay on same color for the last go 'round
        currentColor = colors[colorIndex];
      }else{
        clearInterval(iv);
      }
    }, 460);
  }
}

var ActivityIndicator = function(){
  var t = this;
  this.colorIndex = -1;
  this.colors = ["red", "yellow", "green", "blue"];
  this.currentColor = "initial";
  this.loader = document.getElementById("loader");
  this.isOffline = false;  
  this.isStarted = false;
  this.loopInt = 460;
}
ActivityIndicator.prototype.start = function(){
  var t = this;
  
  t.loader.className = "initial";
  t.iv = setInterval(function(){t.loop();}, t.loopInt);
  t.isStarted = true;
}
ActivityIndicator.prototype.loop = function(){
  var t = this;
  
  var isReadyOff = loader.className.indexOf('readyOff') !== -1;
  var isTransOff = loader.className.indexOf('transitionOff') !== -1;
  var isOffline = loader.className.indexOf('offline') !== -1;
  var isReadyOn = loader.className.indexOf('readyOn') !== -1;
  var isStopping = loader.className.indexOf('stopping') !== -1;
  var isStopped = loader.className.indexOf('stopped') !== -1;

  
  //set next color. if it's 'finishing' keep the color current
  t.colorIndex = !isStopped ? (t.colorIndex+1)%t.colors.length : (t.colorIndex)%t.colors.length;
  
  //in normal state, just make the classname the color name
  t.loader.className = t.colors[t.colorIndex];
  
  //initial state to first state
  !!(t.currentColor === "initial") && (t.loader.className += " firstTime");
  
  //2 states for going offline
  !!(isReadyOff) && (t.loader.className += ' transitionOff');
  !!(isTransOff) && (t.loader.className += ' offline');
  
  t.currentColor = t.colors[t.colorIndex];
  //state for going back online
  !!(isReadyOn) && (t.loader.className += ' transitionOn');
  
  //2 states for stopping
  !!(isStopping) && (t.loader.className = t.currentColor + ' stopped');
  !!(isStopped) && (t.loader.className = t.currentColor + ' finishing');
  
  if(t.loader.className.indexOf('offline') !== -1 || loader.className.indexOf('finishing') !== -1){ // is it's offline or stopped, stop loop
    clearInterval(t.iv);
  }
}
ActivityIndicator.prototype.goOffline = function(){
  var t = this;
  t.loader.className += ' readyOff';
  t.isOffline = true;
}
ActivityIndicator.prototype.goOnline = function(){
  var t = this;
  t.loader.className = t.currentColor + ' readyOn';
  t.isOffline = false;
  t.iv = setInterval(function(){t.loop();}, t.loopInt);
}
ActivityIndicator.prototype.stop = function(){
  var t = this;
  t.loader.className = t.currentColor + ' stopping';
  t.isStarted = false;
}

var p = function(){
  clearInterval(iv);
}
var initLoaderButtons = function(){
  var ldr = $('#loader');
  var ai = new ActivityIndicator();
  
  $('#startLoaderButton').bind('click', function(){
    var _t = $(this);
    $('#offlineButton').show()
    if(ai.isStarted === false){
      ai.start();
      _t.text('Stop loader');
    }else{
      ai.stop();
      _t.text('Start loader');
    }
  });
  
  $('#offlineButton').hide().bind('click', function(){
    var _t = $(this);
    
    if(ai.isOffline === false){
      ai.goOffline();
      _t.text('Go online');
    }else{
      ai.goOnline();
      _t.text('Go offline');
    }
  });
}