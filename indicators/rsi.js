import { createDOM, createURLDOM, calcAverageGain, calcAverageLoss, roundOff } from "../utils.js";
import { RSI_URL, CLOSE } from "../constants.js";

export function updateRSI() {
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