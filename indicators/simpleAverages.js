import { createURLDOM, createDOM, calcSimpleAverage, roundOff } from "../utils.js";
import { SIMPLE_AVERAGES_URL } from "../constants.js";

export function updateSimpleAverages() {
    var averagesDOM = document.getElementById("Simple Averages");
    var urlDOM = createURLDOM(SIMPLE_AVERAGES_URL);
    urlDOM.appendChild(createDOM("b","Simple Averages"));
    averagesDOM.appendChild(urlDOM);

    var simpleAverage10Days = calcSimpleAverage(10);
    var simpleAverage20Days = calcSimpleAverage(20);
    var simpleAverage50Days = calcSimpleAverage(50);

    var simpleAveragesListDOM = document.createElement("ol");
    simpleAveragesListDOM.style = "list-style-type:disc";
    simpleAveragesListDOM.appendChild(createDOM("li", "10 Days Simple Average is: " + roundOff(simpleAverage10Days)));
    simpleAveragesListDOM.appendChild(createDOM("li", "20 Days Simple Average is: " + roundOff(simpleAverage20Days)));
    simpleAveragesListDOM.appendChild(createDOM("li", "50 Days Simple Average is: " + roundOff(simpleAverage50Days)));
    averagesDOM.appendChild(simpleAveragesListDOM);
}