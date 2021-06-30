import { createURLDOM, createDOM, calcExponentialAverage, roundOff } from "../utils.js";
import { EXPONENTIAL_AVERAGES_URL } from "../constants.js";

export function updateExponentialAverages() {
    var averagesDOM = document.getElementById("Exponential Averages");
    var urlDOM = createURLDOM(EXPONENTIAL_AVERAGES_URL);
    urlDOM.appendChild(createDOM("b","Exponential Averages"));
    averagesDOM.appendChild(urlDOM);
    
    var exponentialAverage10Days = calcExponentialAverage(10);
    var exponentialAverage20Days = calcExponentialAverage(20);
    var exponentialAverage50Days = calcExponentialAverage(50);

    var exponentialAveragesListDOM = document.createElement("ol");
    exponentialAveragesListDOM.style = "list-style-type:disc";
    exponentialAveragesListDOM.appendChild(createDOM("li", "10 Days Exponential Average is: " + roundOff(exponentialAverage10Days)));
    exponentialAveragesListDOM.appendChild(createDOM("li", "20 Days Exponential Average is: " + roundOff(exponentialAverage20Days)));
    exponentialAveragesListDOM.appendChild(createDOM("li", "50 Days Exponential Average is: " + roundOff(exponentialAverage50Days)));
    averagesDOM.appendChild(exponentialAveragesListDOM);
}