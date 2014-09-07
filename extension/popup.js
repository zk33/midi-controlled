var midi,vm;

function initializeMidiInput(){
  var inputs = midi.inputs();
  if(inputs){
    for(var i=0,len=inputs.length;i<len;i++){
      inputs[i].onmidimessage=onMidi;
    }
  }
}
function onMidi(e){
  var targ = e.currentTarget;
  vm.deviceId = targ.id;
  vm.deviceName = targ.name;
  var data = e.data;
  if(data[0]==144){
    vm.midiData = data[1];
  }
}



$(function(){

//initialize
vm = new Vue({
  el: '#base',
  data: {
    message:'checking MIDI',
    deviceId:'device id',
    deviceName:'device name',
    midiData:'midi data',
    script:''
  },
  ready: function(){
    var that = this;
    var fail = function(){
      this.message = 'Please enable Web MIDI API via chrome://flags'; 
      $('#main').hide();
    }
    if(!navigator.requestMIDIAccess){
      fail();
      return;
    }
    navigator.requestMIDIAccess().then(function(access){
      that.message = '';
      midi = access;
      initializeMidiInput();
    },fail);
  }
});

});

function initialize(){
  //check if web midi api enabled
}

function getSetting(host){
}

function setSetting(host,setting){
}
