var midi,vm;
var settings = {};
var domainKeys = [];
var storage = chrome.storage.sync;


function connect(fail){
  if(!navigator.requestMIDIAccess){
    fail();
    return;
  }
  navigator.requestMIDIAccess().then(function(access){
    vm.message = '';
    midi = access;
    initialize();
  },fail);
}

function initialize(){
  settings = {};
  domainKeys = [];
  // init midi input
  initializeMidiInput();
  chrome.tabs.query({active:true},function(tabs){
    var currentUrl = tabs[0].url;
    var currentDomainArr = currentUrl.split('//')[1].split('/')[0].split(':')[0].split('.');
    // get data from storage 
    while(true){
      domainKeys.push(currentDomainArr.join('.'));
      currentDomainArr.shift();
      if(currentDomainArr.length < 1){
        break;
      }
    }
    storage.get(domainKeys,function(data){
      settings = vm.settings = data;
      console.log(data);
      vm.domainKeys = domainKeys;
      setTimeout(function(){
        vm.domainKey = domainKeys[0];
      },100);
    });
  });
}

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
    vm.note = data[1];
  }
}

function saveData(key,data){
  var idx = findData(key,data);
  if( idx !== -1){
    settings[key][idx]
  }else{
    if(!settings[key]){
      settings[key] = [];
    }
    settings[key].push(data);
  }
  storage.set(settings,function(){
    vm.message='saved';
    setTimeout(function(){
      vm.message='';
    },3000);
  });
}

function findData(key,data){
  if(settings[key]){
    var arr = settings[key];
    for(var i=0,len=arr.length;i<len;i++){
      var d = arr[i];
      if(data.deviceId == d.deviceId && data.note == d.note){
        return i;
      }
    }
  }
  return -1;
}
