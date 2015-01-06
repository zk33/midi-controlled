var midi,onMidi;
var vm = {};
var settings = {};
var domainKeys = [];
var storage = chrome.storage.sync;


function connect(){
  return new Promise(function(resolve,reject){
    if(!navigator.requestMIDIAccess){
      reject(new Error('Please enable Web MIDI API via chrome://flags'));
    }
    navigator.requestMIDIAccess().then(function(access){
      vm.message = '';
      midi = access;
      resolve();
    },reject);
  });
}


function initDomainKeys(){
  return new Promise(function(resolve,reject){
    chrome.tabs.query({active:true},function(tabs){
      if(tabs.length){
        var currentUrl = tabs[0].url;
        makeDomainKey(currentUrl);
        resolve(domainKeys);
      }else{
        reject(new Error("Couldn't get active tab"));
      }
    });
  });
}
function initDomainKeysByLocation(){
  return new Promise(function(resolve,reject){
    if(location.href){
      makeDomainKey(location.href);
      resolve(domainKeys);
    }else{
      reject(new Error("Couldn't get location.href"));
    }
  });
}
function makeDomainKey(url){
  domainKeys = [];
  var currentDomainArr = url.split('//')[1].split('/')[0].split(':')[0].split('.');
  // get data from storage 
  while(true){
    domainKeys.push(currentDomainArr.join('.'));
    currentDomainArr.shift();
    if(currentDomainArr.length < 1){
      break;
    }
  }
  return domainKeys;
}
function initSettings(){
  return new Promise(function(resolve,reject){
    storage.get(domainKeys,function(data){
      if(chrome.runtime.lastError){
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      settings = vm.settings = data;
      vm.domainKeys = domainKeys;
      setTimeout(function(){
        vm.domainKey = domainKeys[0];
        resolve(settings);
      },100);
    });
  });
}

function initMidiInput(){
  var inputs = midi.inputs;
  if(inputs){
    var entries = inputs.entries();
    while(true){
      var entry = entries.next();
      if(!entry || entry.done){
        break;
      }
      entry.value[1].onmidimessage=onMidi;
    }
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
