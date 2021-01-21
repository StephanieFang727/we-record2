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
      let calendarData ={}; 
      try {
        calendarData = await getStorageData('allCalData');
      } catch(e) {
        console.log(e);
      }
      if(!calendarData[date]){
        calendarData[date] = {};
       }
      return calendarData;
  },
  setCalendarData: async function(todoDetail, date, calData) {
    let temp = calData;
    temp[date] = {...temp[date], ...todoDetail};
    console.log(temp[date]);
    try{
      await setStorageData('allCalData',temp);
    } catch(e) {
      console.log(e)
    }
    return temp;
  }
}
})