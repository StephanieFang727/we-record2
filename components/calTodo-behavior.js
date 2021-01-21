import {getStorageData, setStorageData, wxp}  from '../utils/api';
module.exports = Behavior({
  behaviors: [],
  properties: {
  
  },
  data: {
   
  },
  lifetimes: {
    attached: function() {
     
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  created: function () {
  },
  attached: function () {
  },
  ready: function () {
  },

  methods: {
    getAllCalendarData: async function(date) {
      let calendarData = this.store.data.calendarData; 
      if(!calendarData){
        try {
          calendarData = await getStorageData('allCalData');
        } catch(e) {
          console.log(e);
          calendarData = {};
        }
      }
      if(!calendarData[date]){
        calendarData[date] = {};
       }
      this.store.data.calendarData = calendarData;
      console.log(this.store.data.calendarData);
      return calendarData;
  },
  setCalendarData: async function(todoDetail, date) {
    let temp = Object.assign({}, this.store.data.calendarData);
    console.log(temp, date);
     temp[date] = {...temp[date], ...todoDetail};
    console.log(temp[date]);
    try{
      await setStorageData('allCalData',temp);
    } catch(e) {
      console.log(e)
    }
    
    this.store.data.calendarData = temp;
    return temp;
  }
}
})