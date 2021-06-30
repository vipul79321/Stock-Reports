import {OPEN, HIGH, LOW, CLOSE, VOLUME, BASE_URL} from "./constants.js"

export function isValidPriceObject(priceObject) {
    if('open' in priceObject && 
    'high' in priceObject && 
    'low' in priceObject && 
    'close' in priceObject && 
    'volume' in priceObject) {
        return true;
    }
    return false;
}

export function createDOM(tag, text) {
    var entryDOM = document.createElement(tag);
    var textNode = document.createTextNode(text);
    entryDOM.appendChild(textNode);
    return entryDOM;
}

export function createURLDOM(URL) {
    var urlDOM = document.createElement("a");
    urlDOM.style = "text-decoration:none";
    urlDOM.href = URL;
    return urlDOM;
}

export function roundOff(val) {
    return Math.round(val*100)/100;
}

export function calcSimpleAverage(days, start=0) {
    var simpleAverage = 0;
    for(var index = start; index < start+days; index++) {
        simpleAverage += CLOSE[index];
    }
    return simpleAverage/days;
}

export function calcExponentialAverage(days, start=0) {
    var exponentialAverage = calcSimpleAverage(days,start+days);
    var multiplier = 2/(days+1);
    for(var index=start+days-1; index>=start; index--) {
        exponentialAverage = CLOSE[index]*multiplier + exponentialAverage*(1-multiplier);
    }
    return exponentialAverage;
}

export function calcStandardDeviation(days, start=0) {
    var simpleAverage = calcSimpleAverage(days, start);
    var standardDeviation = 0;
    for(var index=start; index<start+days; index++) {
        standardDeviation += (simpleAverage - CLOSE[index])*(simpleAverage - CLOSE[index]);
    }
    standardDeviation = Math.sqrt(standardDeviation / days);
    return standardDeviation;
}

export function calcAverageGain(days, start=0) {
    var averageGain = 0;
    for(var index=start; index<start+days; index++) {
        if(CLOSE[index] > CLOSE[index+1]) {
            averageGain += (CLOSE[index] - CLOSE[index+1])/ CLOSE[index];
        }
    }
    return averageGain/days;
}

export function calcAverageLoss(days, start=0) {
    var averageLoss = 0;
    for(var index=start; index<start+days; index++) {
        if(CLOSE[index] < CLOSE[index+1]) {
            averageLoss += (CLOSE[index+1] - CLOSE[index])/ CLOSE[index+1];
        }
    }
    return averageLoss/days;
}

export function emptyAll() {
    document.getElementById("Simple Averages").innerHTML = '';
    document.getElementById("Exponential Averages").innerHTML= '';
    document.getElementById("MACD").innerHTML = '';
    document.getElementById("RSI").innerHTML = '';
    document.getElementById("Bollinger Bands").innerHTML = '';
    document.getElementById("Latest Price Info").innerHTML = '';
    document.getElementById("Error").innerHTML = '';
    OPEN.length = 0, HIGH.length = 0, LOW.length = 0, CLOSE.length = 0, VOLUME.length = 0;
}

export function getUrl(stockSymbol) {
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

