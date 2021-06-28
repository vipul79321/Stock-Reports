const OPEN = new Array();
const HIGH = new Array();
const LOW = new Array();
const CLOSE = new Array();
const VOLUME = new Array();
const BASE_URL = "https://in.finance.yahoo.com/quote/{stock}/history?period1={start-date}&period2={end-date}&interval=1d&filter=history&frequency=1d&includeAdjustedClose=false";
const MACD_URL = "https://www.investopedia.com/terms/m/macd.asp";
const RSI_URL = "https://www.investopedia.com/terms/r/rsi.asp";
const SIMPLE_AVERAGES_URL = "https://www.investopedia.com/terms/s/sma.asp";
const EXPONENTIAL_AVERAGES_URL = "https://www.investopedia.com/terms/e/ema.asp";

function isValidPriceObject(priceObject) {
    if('open' in priceObject && 
    'high' in priceObject && 
    'low' in priceObject && 
    'close' in priceObject && 
    'volume' in priceObject) {
        return true;
    }
    return false;
}

function createDOM(tag, text) {
    var entryDOM = document.createElement(tag);
    var textNode = document.createTextNode(text);
    entryDOM.appendChild(textNode);
    return entryDOM;
}

function createURLDOM(URL) {
    var urlDOM = document.createElement("a");
    urlDOM.style = "text-decoration:none";
    urlDOM.href = URL;
    return urlDOM;
}

function roundOff(val) {
    return Math.round(val*100)/100;
}

function calcSimpleAverage(days, start=0) {
    var simpleAverage = 0;
    for(var index = start; index < start+days; index++) {
        simpleAverage += CLOSE[index];
    }
    return roundOff(simpleAverage/days);
}

function calcExponentialAverage(days, start=0) {
    var exponentialAverage = calcSimpleAverage(days,start+days);
    var multiplier = 2/(days+1);
    for(var index=start+days-1; index>=start; index--) {
        exponentialAverage = CLOSE[index]*multiplier + exponentialAverage*(1-multiplier);
    }
    return roundOff(exponentialAverage);
}

function calcAverageGain(days, start=0) {
    var averageGain = 0;
    for(var index=start; index<start+days; index++) {
        if(CLOSE[index] > CLOSE[index+1]) {
            averageGain += (CLOSE[index] - CLOSE[index+1])/ CLOSE[index];
        }
    }
    return averageGain/days;
}

function calcAverageLoss(days, start=0) {
    var averageLoss = 0;
    for(var index=start; index<start+days; index++) {
        if(CLOSE[index] < CLOSE[index+1]) {
            averageLoss += (CLOSE[index+1] - CLOSE[index])/ CLOSE[index+1];
        }
    }
    return averageLoss/days;
}

function updateSimpleAverages() {
    var averagesDOM = document.getElementById("Averages");
    averagesDOM.innerHTML = '';
    var urlDOM = createURLDOM(SIMPLE_AVERAGES_URL);
    urlDOM.appendChild(createDOM("b","Simple Averages"));
    averagesDOM.appendChild(urlDOM);

    var simpleAverage10Days = calcSimpleAverage(10);
    var simpleAverage20Days = calcSimpleAverage(20);
    var simpleAverage50Days = calcSimpleAverage(50);

    var simpleAveragesListDOM = document.createElement("ol");
    simpleAveragesListDOM.style = "list-style-type:disc";
    simpleAveragesListDOM.appendChild(createDOM("li", "10 Days Simple Average is: " + simpleAverage10Days));
    simpleAveragesListDOM.appendChild(createDOM("li", "20 Days Simple Average is: " + simpleAverage20Days));
    simpleAveragesListDOM.appendChild(createDOM("li", "50 Days Simple Average is: " + simpleAverage50Days));
    averagesDOM.appendChild(simpleAveragesListDOM);
}

function updateExponentialAverages() {
    var averagesDOM = document.getElementById("Averages");
    var urlDOM = createURLDOM(EXPONENTIAL_AVERAGES_URL);
    urlDOM.appendChild(createDOM("b","Exponential Averages"));
    averagesDOM.appendChild(urlDOM);
    
    var exponentialAverage10Days = calcExponentialAverage(10);
    var exponentialAverage20Days = calcExponentialAverage(20);
    var exponentialAverage50Days = calcExponentialAverage(50);

    var exponentialAveragesListDOM = document.createElement("ol");
    exponentialAveragesListDOM.style = "list-style-type:disc";
    exponentialAveragesListDOM.appendChild(createDOM("li", "10 Days Exponential Average is: " + exponentialAverage10Days));
    exponentialAveragesListDOM.appendChild(createDOM("li", "20 Days Exponential Average is: " + exponentialAverage20Days));
    exponentialAveragesListDOM.appendChild(createDOM("li", "50 Days Exponential Average is: " + exponentialAverage50Days));
    averagesDOM.appendChild(exponentialAveragesListDOM);

}

function updateMACD() {
    var macdDOM = document.getElementById("MACD");
    macdDOM.innerHTML = '';
    var urlDOM = createURLDOM(MACD_URL);
    urlDOM.appendChild(createDOM("b","MACD"));
    macdDOM.appendChild(urlDOM);
    

    var ema12 = new Array(), ema26 = new Array();
    for(var index=0; index<18; index++) {
        ema12.push(calcExponentialAverage(12,index));
        ema26.push(calcExponentialAverage(26,index));
    }

    var signalLineValue = 0;
    var macdValue = ema12[0] - ema26[0];
    for(var index=9; index<18; index++) {
        signalLineValue += ema12[index] - ema26[index];
    }
    signalLineValue = signalLineValue/9;

    var multiplier = 2/(9+1);
    for(var index=8; index>=0; index--) {
        signalLineValue = (ema12[index] - ema26[index])*multiplier + signalLineValue*(1-multiplier);
    }

    var macdListDOM = document.createElement("ol");
    macdListDOM.style = "list-style-type:disc";
    macdListDOM.appendChild(createDOM("li", "MACD value: " + roundOff(macdValue)));
    macdListDOM.appendChild(createDOM("li", "Signal value: " + roundOff(signalLineValue)));

    if(signalLineValue > macdValue) {
        macdListDOM.appendChild(createDOM("li","MACD Line is below Signal Line, indicating Bearish Trend"));
    } else if(signalLineValue < macdValue) {
        macdListDOM.appendChild(createDOM("li","MACD Line is above Signal Line, indicating Bullish Trend"));
    } else {
        macdListDOM.appendChild(createDOM("li","Neutral Trend"));
    }
    macdDOM.appendChild(macdListDOM);
}

function updateRSI() {
    var prevAvgGain = calcAverageGain(14,14);
    var prevAvgLoss = calcAverageLoss(14,14);
    var rsi = 0;

    for(var index=13; index>=0; index--) {
        var currentAvgGain = CLOSE[index] > CLOSE[index+1] ? CLOSE[index]/CLOSE[index+1] - 1 : 0;
        currentAvgGain = (prevAvgGain*13 + currentAvgGain) / 14;
        var currentAvgLoss = CLOSE[index] < CLOSE[index+1] ? 1 - CLOSE[index]/CLOSE[index+1] : 0;
        currentAvgLoss = (prevAvgLoss*13 + currentAvgLoss) / 14;

        rsi = 100 - 100/(1 + currentAvgGain/currentAvgLoss);

        prevAvgGain = currentAvgGain;
        prevAvgLoss = currentAvgLoss;
    }

    var rsiDOM = document.getElementById("RSI");
    rsiDOM.innerHTML = '';
    var urlDOM = createURLDOM(RSI_URL);
    urlDOM.appendChild(createDOM("b","Relative Strength Index(RSI)"));
    rsiDOM.appendChild(urlDOM);;

    var rsiListDOM = document.createElement("ol");
    rsiListDOM.style = "list-style-type:disc";
    rsiListDOM.appendChild(createDOM("li","RSI value is: " + roundOff(rsi)));
    if(rsi > 70) {
        rsiListDOM.appendChild(createDOM("li","RSI value above 70 indicates that stock is overbought"));
    } else if(rsi < 30) {
        rsiListDOM.appendChild(createDOM("li","RSI value below 30 indicates that stock is oversold"));
    } else {
        rsiListDOM.appendChild(createDOM("li","RSI value between [30,70] indicates that stock is neither overbought nor oversold"));
    }
    rsiDOM.appendChild(rsiListDOM);

}


function updateHistoricalData(stockUrl) {
    OPEN.length = 0, HIGH.length = 0, LOW.length = 0, CLOSE.length = 0, VOLUME.length = 0;
    jQuery.get(stockUrl,function(data) {
        var dStr = String(data);
        var indexOfHistoricalPriceStore = dStr.indexOf('HistoricalPriceStore');
        var jsonArrayBegin = indexOfHistoricalPriceStore + 32;  // "HistoricalPriceStore:{"prices":[
        var jsonArrayEnd = jsonArrayBegin + 1;
        while(dStr[jsonArrayEnd] != ']') {
            jsonArrayEnd = jsonArrayEnd + 1;
        }

        var jsonString = dStr.substring(jsonArrayBegin,jsonArrayEnd+1);
        try {
            var jsonArray = jQuery.parseJSON(jsonString);
        } catch(error){
            document.body.innerHTML = "Invalid Stock symbol";
            console.log("Invalid Stock Symbol");
            return;
        }
        
        for(var index in jsonArray) {
            var priceObject = jsonArray[index];
            if(isValidPriceObject(priceObject)) {
                OPEN.push(priceObject.open);
                HIGH.push(priceObject.high);
                LOW.push(priceObject.low);
                CLOSE.push(priceObject.close);
                VOLUME.push(priceObject.volume);
                
            }
        }
        document.getElementById("LTP").innerHTML = '';
        document.getElementById("LTP").appendChild(createDOM("h4", "Last Traded Price: " + roundOff(CLOSE[0])));
        updateSimpleAverages();
        updateExponentialAverages();
        updateMACD();
        updateRSI();
    });
}

function getUrl(stockSymbol) {
    var endDate = new Date();
    var startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    console.log(startDate + " " + endDate);
    var stockURL = BASE_URL
    .replace('{stock}', stockSymbol)
    .replace('{start-date}',Math.floor(startDate.getTime()/1000))
    .replace('{end-date}',Math.floor(endDate.getTime()/1000));

    console.log(stockURL);
    return stockURL;
}

window.onload = function () {
    var btn = document.getElementById("getStockReport");
    var stockSymbol = document.getElementById("stockSymbol");
    btn.onclick = function () {
        console.log(stockSymbol.value);
        var symbol = stockSymbol.value;
        var stockUrl = getUrl(symbol);
        updateHistoricalData(stockUrl);
    }
}