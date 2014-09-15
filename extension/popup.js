$(function(){

onMidi = function(e){
  var targ = e.currentTarget;
  vm.deviceId = targ.id;
  vm.deviceName = targ.name;
  var data = e.data;
  if(data[0]==144){
    vm.note = data[1];
  }
}

//initialize
vm = new Vue({
  el: '#base',
  data: {
    domainKeys:[],
    domainKey:'',
    message:'checking MIDI',
    deviceId:'device id',
    deviceName:'device name',
    note:'midi data',
    script:'',
    settings:{}
  },
  ready: function(){
    var that = this;
    var fail = function(err){
      that.message = err.description; 
      $('#main').hide();
    }
    connect()
      .then(initDomainKeys)
      .then(initSettings)
      .then(initMidiInput)
      .catch(fail);
  },
  methods:{
    save: function(){
      var $data = this.$data;
      if($data.domainKey && $data.script && $data.deviceId != 'device id' && $data.note != 'midi data'){
        var res={
          deviceId:$data.deviceId,
          deviceName:$data.deviceName,
          note:$data.note,
          action:$data.script,
          displayName:$data.displayName
        }
        saveData($data.domainKey,res);
      }
    }
  }
});

});


