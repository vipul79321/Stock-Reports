import { roundOff, createDOM } from "../utils.js";
import { CLOSE } from "../constants.js";

export function updateLTP() {
    document.getElementById("LTP").appendChild(createDOM("h4", "Last Traded Price: " + roundOff(CLOSE[0])));
}