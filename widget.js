const plausibleSite = ""
const bearerToken = ""

const ACCENT_COLOR = "rgba(106, 121, 207,1.0)"
const ACCENT_COLOR_HIDDEN = "rgba(106, 121, 207,0.3)"
const ACCENT_COLOR_LIGHT = "rgba(106, 121, 207,0.3)"
const ACCENT_COLOR_LIGHT_HIDDEN = "rgba(106, 121, 207,0.15)"

const DARK_MODE = true

const TEXT_COLOR = DARK_MODE ? new Color("#FFF") : new Color("#000")
const TEXT_COLOR_LIGHT =  DARK_MODE ? new Color("#fff", 0.6) : new Color("#000", 0.6)

const TIME_RANGE = args.widgetParameter

const POSSIBLE_PERIODS = ["6mo","12mo","7d","30d","month"]


let period = "7d"

if(POSSIBLE_PERIODS.includes(TIME_RANGE)){  
  period = TIME_RANGE
}

try{
  const stats = new Request("https://plausible.io/api/v1/stats/aggregate?site_id="+plausibleSite+"&period="+period+"&metrics=visitors,pageviews,bounce_rate,visit_duration&compare=previous_period")
    stats.headers = {'Authorization':'Bearer '+bearerToken}
  const statsResult = await stats.loadJSON()

  if (config.runsInWidget) {
    
      let plausibleWidget = await setupWidget();
    
    if (config.widgetFamily === "small") {
     await setSmallData(plausibleWidget,statsResult,period);
    }
    if (config.widgetFamily === "medium") {
      await setMediumData(plausibleWidget,statsResult,period);
    }
    if (config.widgetFamily === "large") {
      await setLargeData(plausibleWidget,statsResult,period);
      
    }
    
    Script.setWidget(plausibleWidget);
    
  } else {
    
    let plausibleWidget = await setupWidget();
    //await setLargeData(plausibleWidget);
    //plausibleWidget.presentLarge();
    
    //await setMediumData(plausibleWidget);
    //plausibleWidget.presentMedium();
    
     await setSmallData(plausibleWidget,statsResult,period);
    plausibleWidget.presentSmall();
    
  }
  
} catch(e){
  let plausibleWidget = await showErrorWidget();
  if (config.runsInWidget) {
     Script.setWidget(plausibleWidget);
  }else{
    plausibleWidget.presentSmall();
  }
}


async function setupWidget(){
  
  let widget = new ListWidget();
  
  widget.backgroundColor = DARK_MODE ?  new Color("#111927") : new Color("#FFFFFF")
  
  return widget;
}

async function showErrorWidget(){
   let widget = new ListWidget();
    widget.backgroundColor = DARK_MODE ?  new Color("#111927") : new Color("#FFFFFF")
    
    const stack = widget.addStack()
    stack.layoutVertically()
    stack.centerAlignContent()
    
     const noConnection = SFSymbol.named("wifi.slash")
    noConnection.applyFont(Font.boldSystemFont(30))
    const noConnectionImage = stack.addImage(noConnection.image)
    noConnectionImage.imageSize = new Size(25,25)
    noConnectionImage.tintColor = TEXT_COLOR
    
    return widget;
    
}

async function setLargeData(widget,statsResult,period){
    
    const stack = widget.addStack()
    stack.layoutVertically()
    stack.topAlignContent()
    stack.setPadding(0, 0, 0, 0)
    
    const titleStack = stack.addStack()
    titleStack.centerAlignContent()
    
    const globe = SFSymbol.named("globe")
    globe.applyFont(Font.boldSystemFont(20))
    const globeImage = titleStack.addImage(globe.image)
    globeImage.imageSize = new Size(10,10)
    globeImage.tintColor = TEXT_COLOR
    titleStack.addSpacer(3)
    
    const siteTitle = titleStack.addText(plausibleSite)
    siteTitle.font = Font.semiboldRoundedSystemFont(12)
    siteTitle.textColor = TEXT_COLOR
    
    const dot = titleStack.addText(" • ")
    dot.textColor = TEXT_COLOR
    
    
    const periodTitle = titleStack.addText(getPeriodTitle(period))
    periodTitle.font = Font.semiboldRoundedSystemFont(12)
    periodTitle.textColor = TEXT_COLOR
    
    stack.addSpacer(15)
    
    const row = stack.addStack()
    
    await createDetailCol(row,"UNIQUE VISITORS",statsResult.results.visitors.value.toLocaleString(),statsResult.results.visitors.change)
    
    await createDetailCol(row,"TOTAL PAGEVIEWS",statsResult.results.pageviews.value.toLocaleString(),statsResult.results.pageviews.change)
    
    stack.addSpacer(15)
    
    const secondRow = stack.addStack()
    await createDetailCol(secondRow,"BOUNCE RATE",statsResult.results.bounce_rate.value.toLocaleString()+ "%",statsResult.results.bounce_rate.change,false,true)
    
    const visit_dur = toHHMMSS(statsResult.results.visit_duration.value)
    
    await createDetailCol(secondRow,"VISIT DURATION",visit_dur,statsResult.results.visit_duration.change)
    
    stack.addSpacer(20)
    
    const image = await getChartImage(period);
    
    const chart = stack.addImage(image)
    chart.leftAlignImage()

}

async function setSmallData(widget,statsResult,period){
 
    widget.setPadding(0,0,0,0)
    const stack = widget.addStack()
    stack.layoutVertically()
    
    stack.setPadding(20, 20, 20, 0)    
    
    const titleStack = stack.addStack()
    titleStack.centerAlignContent()
    
    const globe = SFSymbol.named("globe")
    globe.applyFont(Font.boldSystemFont(14))
    const globeImage = titleStack.addImage(globe.image)
    globeImage.imageSize = new Size(9,9)
    globeImage.tintColor = TEXT_COLOR
    titleStack.addSpacer(3)
    
    const siteTitle = titleStack.addText(plausibleSite)
    siteTitle.font = Font.semiboldRoundedSystemFont(11)
    siteTitle.textColor = TEXT_COLOR
    
    titleStack.addSpacer()
    stack.addSpacer(3)
    
    const periodStack = stack.addStack()
    
    const periodTitle = periodStack.addText(getPeriodTitle(period))
    periodTitle.font = Font.semiboldRoundedSystemFont(10)
    periodTitle.textColor = TEXT_COLOR
    
    
    stack.addSpacer()
    
    const row = stack.addStack()
    
     const firstCol = row.addStack()
    firstCol.layoutVertically()
    const todayTitle = firstCol.addText("UNIQUE VISITORS") 
    const todayValue = firstCol.addText(statsResult.results.visitors.value.toLocaleString())
    
    
    todayTitle.font = Font.boldMonospacedSystemFont(10)
    todayTitle.textColor = TEXT_COLOR_LIGHT 
    todayValue.font = Font.boldMonospacedSystemFont(24)
    todayValue.textColor = TEXT_COLOR
    
    
    const detailRow = firstCol.addStack()
    detailRow.layoutHorizontally()
    detailRow.centerAlignContent()
    const symbolStack = detailRow.addStack()
    
    let diff = statsResult.results.visitors.change
    
    let symbolName = "arrow.down"
    let symbolColor = "#eb3b5a"
    let prefix = ""
    
    if(diff>0){
      symbolName = "arrow.up"
      symbolColor = "#20bf6b"
      prefix = "+"
    }else if(diff == 0){
      symbolName = "arrow.right"
      symbolColor = "#d1d8e0"
    }
      
    const symbol = SFSymbol.named(symbolName)
    symbol.applyFont(Font.boldSystemFont(20))
    const arrowImage = symbolStack.addImage(symbol.image)
    arrowImage.imageSize = new Size(6,6)
    arrowImage.tintColor = new Color(symbolColor)
    symbolStack.size = new Size(12,12)
    symbolStack.backgroundColor = new Color(symbolColor,0.2)
    symbolStack.cornerRadius = 6
    symbolStack.centerAlignContent()
    
    detailRow.addSpacer(3)
  
    const detailDiff = detailRow.addText(prefix+diff+"%")
    detailDiff.font = Font.semiboldSystemFont(9)
    detailDiff.textColor = new Color(symbolColor)
    
   
    const image = await getChartImage(period,true,true);
    widget.backgroundImage = image
}

function getPeriodTitle(period){
  
  let periodTitleText = ""
    switch(period){
      case "12mo":periodTitleText = "Last 12 Months";break;
      case "7d":periodTitleText = "Last 7 days";break;
      case "30d": periodTitleText = "Last 30 days";break;
      case "month": periodTitleText = "This Month ";break;
      default : periodTitleText = "Last 6 Months"
    }
   return periodTitleText;
    
}

async function setMediumData(widget,statsResult,period){

    const stack = widget.addStack()
    stack.layoutVertically()
    stack.topAlignContent()
    stack.setPadding(0, 5, 0, 0)
    
    const titleStack = stack.addStack()
    titleStack.centerAlignContent()
    
    const globe = SFSymbol.named("globe")
    globe.applyFont(Font.boldSystemFont(14))
    const globeImage = titleStack.addImage(globe.image)
    globeImage.imageSize = new Size(9,9)
    globeImage.tintColor = TEXT_COLOR
    titleStack.addSpacer(3)
    
    const siteTitle = titleStack.addText(plausibleSite)
    siteTitle.font = Font.semiboldRoundedSystemFont(11)
    siteTitle.textColor = TEXT_COLOR
    
    const dot = titleStack.addText(" • ")
    dot.textColor = TEXT_COLOR
    
    const periodTitle = titleStack.addText(getPeriodTitle(period))
    periodTitle.font = Font.semiboldRoundedSystemFont(11)
    periodTitle.textColor = TEXT_COLOR
    
    stack.addSpacer(5)
    
    
    const row = stack.addStack()
    
    await createDetailCol(row,"UNIQUE VISITORS",statsResult.results.visitors.value.toLocaleString(),statsResult.results.visitors.change,true)
    
    await createDetailCol(row,"TOTAL PAGEVIEWS",statsResult.results.pageviews.value.toLocaleString(),statsResult.results.pageviews.change,true)
    
    stack.addSpacer(10)
    
    const secondRow = stack.addStack()
    await createDetailCol(secondRow,"BOUNCE RATE",statsResult.results.bounce_rate.value.toLocaleString()+ "%",statsResult.results.bounce_rate.change,true,true)
    
    const visit_dur = toHHMMSS(statsResult.results.visit_duration.value)
    
    await createDetailCol(secondRow,"VISIT DURATION",visit_dur,statsResult.results.visit_duration.change,true)
    
    const image = await getChartImage(period,true);
    widget.backgroundImage = image
    
    
}



async function createDetailCol(row,title,value,diff,small = false,reversed = false){
  
  const firstCol = row.addStack()
  firstCol.layoutVertically()
  firstCol.size = new Size(150,50)
  
  const todayTitle = firstCol.addText(title)
  const todayValue = firstCol.addText(value)
  todayTitle.font = Font.boldMonospacedSystemFont(10)
  todayTitle.textColor = TEXT_COLOR_LIGHT 
  todayValue.font = Font.boldMonospacedSystemFont(small ? 20 : 22)
  todayValue.textColor = TEXT_COLOR
  
  const detailRow = firstCol.addStack()
  detailRow.layoutHorizontally()
  detailRow.centerAlignContent()
  const symbolStack = detailRow.addStack()
  
  let symbolName = "arrow.down"
  let symbolColor = reversed ?  "#20bf6b" : "#eb3b5a"
  let prefix = ""
  if(diff>0){
    symbolName = "arrow.up"
    symbolColor = reversed ?  "#eb3b5a": "#20bf6b"
    prefix = "+"
  }else if(diff == 0){
    symbolName = "arrow.right"
    symbolColor = "#d1d8e0"
  }
    
  const symbol = SFSymbol.named(symbolName)
  symbol.applyFont(Font.boldSystemFont(20))
  const arrowImage = symbolStack.addImage(symbol.image)
  arrowImage.imageSize = new Size(6,6)
  arrowImage.tintColor = new Color(symbolColor)
  symbolStack.size = new Size(12,12)
  symbolStack.backgroundColor = new Color(symbolColor,0.2)
  symbolStack.cornerRadius = 6
  symbolStack.centerAlignContent()
  
  detailRow.addSpacer(3)
  
  const detailDiff = detailRow.addText(prefix+diff+"%")
  detailDiff.font = Font.semiboldSystemFont(9)
  detailDiff.textColor = new Color(symbolColor)
  
}

async function getChartImage(period,hideDetails = false,square = false){
    const history = new Request("https://plausible.io/api/v1/stats/timeseries?site_id="+plausibleSite+"&period="+period)
    
    history.headers = {'Authorization':'Bearer '+bearerToken}
      
    const historyResult = await history.loadJSON()
    const historyArray = historyResult.results
    
    let visitors = []
    let dates = []
    
    for(var i = 0;i < historyArray.length; i++){
      visitors.push(historyArray[i].visitors)
      let d = new Date(historyArray[i].date)
     
    if(period =="7d" || period == "30d" || period == "month"){
      d = d.toLocaleString('default', { day:'2-digit',month: '2-digit' })
    }else{
      d = d.toLocaleString('default', { year:'2-digit',month: '2-digit' })
    }
      dates.push(d)
    }
    
    
    const newChartConfig = {
      type:'line',
      data:{
         labels:dates,
         datasets:[
          {
            label:'',
            data:visitors,
            fill:true,
            borderColor:hideDetails ? ACCENT_COLOR_HIDDEN : ACCENT_COLOR,
            borderWidth:7,
            pointRadius:hideDetails ? 0 : 8,
            backgroundColor:hideDetails ? ACCENT_COLOR_LIGHT_HIDDEN : ACCENT_COLOR_LIGHT,
            pointBackgroundColor:"#fff",
            lineTension: 0.4
          }
         ]
      },
      options:{
        layout: {
        padding: {
            bottom: square ? -10 : 0,
            left: hideDetails? -10 : 0
        }
    },
        title: {
          display: true,
          text: '',
          fontSize:30
        },
        scales:{
          xAxes:[
            {
            gridLines: {
              display:false,
              drawBorder:false
            },
              ticks:{
                display:hideDetails ? false : true,
                fontSize:28,
                weight:'bold',
                fontColor: DARK_MODE ? "#fff" : "#000",
              }
            }
          ],
          yAxes:[
          {
            gridLines: {
              display:!hideDetails,
              color: DARK_MODE ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              drawBorder:false
            },
            ticks:{
                display:false,
                fontSize:20,
                weight:'bold'
              }
          }
          ]
        },
        legend:{
            display:false
        },
        
        plugins: {
          datalabels: {
            display: hideDetails ? false : true,
            align: 'top',
            font:{
              size:30,
              weight:'bold',
            },
            color: DARK_MODE ? "#fff" : "#000",
            offset:8
          },
          
        }
      }
    }
    let width = square ? 400 : 800
    let height = square ? 400 : 400
    let request = new Request("https://quickchart.io/chart?c="+encodeURIComponent(JSON.stringify(newChartConfig))+"&format=png&w="+width+"&h="+height)
    
    return await request.loadImage()
}


function toHHMMSS(secs){
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

