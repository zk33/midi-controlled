$(function(){

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
    var fail = function(){
      that.message = 'Please enable Web MIDI API via chrome://flags'; 
      $('#main').hide();
    }
    connect(fail);
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


