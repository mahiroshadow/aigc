const option: any = {
  tooltip: {
    trigger: 'item',
    /* formatter: '{b}<br/>{c} (p / km2)' */
    formatter: function (params: any) {
      //用于显示多个数据
      let res = params.name + '<br/>'
      const myseries = option.series
      for (let i = 0; i < myseries.length; i++) {
        for (let j = 0; j < myseries[i].data.length; j++) {
          if (myseries[i].data[j].name == params.name) {
            res += myseries[i].name + ' : ' + myseries[i].data[j].value + '</br>'
          }
        }
      }
      return res
    }
  },
  visualMap: {
    min: 500,
    max: 50000,
    text: ['High', 'Low'],
    left: 'right',
    realtime: false,
    calculable: true,
    show: false,
    inRange: {
      color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#718cef', '#947aad']
    }
  },
  series: []
}

export { option }
