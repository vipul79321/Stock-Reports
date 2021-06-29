import { createURLDOM, createDOM, calcExponentialAverage, roundOff } from "../utils.js";
import { MACD_URL } from "../constants.js"; 

export function updateMACD() {
    var macdDOM = document.getElementById("MACD");
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
