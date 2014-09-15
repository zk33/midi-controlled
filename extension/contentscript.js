
onMidi = function(e){
  var targ = e.currentTarget;
  var data = e.data;
  if(data[0]==144){
    var deviceId = targ.id;
    var note = data[1];
    for(key in settings){
      var arr = settings[key];
      for(var i=0,len=arr.length;i<len;i++){
        var item = arr[i];
        if(deviceId === item.deviceId && note === item.note){
          (new Function([],item.action))();
        }
      }
    }
  }
}

connect()
  .then(initDomainKeysByLocation)
  .then(initSettings)
  .then(initMidiInput)
  .catch(function(d){console.log('error',d);});
