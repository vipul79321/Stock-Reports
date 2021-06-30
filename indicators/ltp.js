import { roundOff, createDOM } from "../utils.js";
import { CLOSE, OPEN, LOW, HIGH, VOLUME } from "../constants.js";

export function updateLTP() {

    var ltpDOM = document.getElementById("Latest Price Info");
    ltpDOM.appendChild(createDOM("h4", "Latest Price Info"));

    var ltpListDOM = document.createElement("ol");
    ltpListDOM.style = "list-style-type:disc";

    ltpListDOM.appendChild(createDOM("li", "Last Traded Price : " + roundOff(CLOSE[0])));
    ltpListDOM.appendChild(createDOM("li", "Open : " + roundOff(OPEN[0])));
    ltpListDOM.appendChild(createDOM("li", "High : " + roundOff(HIGH[0])));
    ltpListDOM.appendChild(createDOM("li", "Low : " + roundOff(LOW[0])));
    ltpListDOM.appendChild(createDOM("li", "Volume : " + roundOff(VOLUME[0])));

    ltpDOM.appendChild(ltpListDOM);
}