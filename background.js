import { createDOM, isValidPriceObject, emptyAll, getUrl } from "./utils.js";
import { OPEN, HIGH, LOW, CLOSE, VOLUME } from "./constants.js";
import { updateLTP } from "./indicators/ltp.js";
import { updateSimpleAverages } from "./indicators/simpleAverages.js";
import { updateExponentialAverages } from "./indicators/exponentialAverages.js";
import { updateMACD } from "./indicators/macd.js";
import { updateRSI } from "./indicators/rsi.js";
import { updateBollingerBands } from "./indicators/bollingerBand.js";

function updateHistoricalData(stockUrl) {

    emptyAll();

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
            document.getElementById("Error").appendChild(createDOM("p"," Invalid Stock Symbol"));
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

        updateLTP();
        updateSimpleAverages();
        updateExponentialAverages();
        updateMACD();
        updateRSI();
        updateBollingerBands();
    });
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