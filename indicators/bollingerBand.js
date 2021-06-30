import { createDOM, createURLDOM, calcSimpleAverage, calcStandardDeviation, roundOff } from "../utils.js";
import { BOLLINGER_BANDS_URL, CLOSE } from "../constants.js";

export function updateBollingerBands() {
    var bollingerBandDOM = document.getElementById("Bollinger Bands");
    var urlDOM = createURLDOM(BOLLINGER_BANDS_URL);
    urlDOM.appendChild(createDOM("b","Bollinger Bands"));
    bollingerBandDOM.appendChild(urlDOM);

    var middleBollingerBand = calcSimpleAverage(20);
    var upperBollingerBand = middleBollingerBand + calcStandardDeviation(20);
    var lowerBollingerBand = middleBollingerBand - calcStandardDeviation(20);

    var bollingerBandListDOM = document.createElement("ol");
    bollingerBandListDOM.style = "list-style-type:disc";

    bollingerBandListDOM.appendChild(createDOM("li", "Upper Bollinger Band value is: " + roundOff(upperBollingerBand)));
    bollingerBandListDOM.appendChild(createDOM("li", "Middle Bollinger Band value is: " + roundOff(middleBollingerBand)));
    bollingerBandListDOM.appendChild(createDOM("li", "Lower Bollinger Band value is: " + roundOff(lowerBollingerBand)));
    
    bollingerBandListDOM.appendChild(createDOM("li", `For a Bullish trade setup, Upper and Lower Bollinger Band can be used as Target & Stoploss respectively
     and vice-versa for a Bearish trade setup`));
    
    bollingerBandDOM.appendChild(bollingerBandListDOM);
}