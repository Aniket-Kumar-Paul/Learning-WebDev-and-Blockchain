// NOTE: UpDown is a reducer, 
// we can create multiple reducers similarly, 
// but at end only one root reducer will be used which is this one (index.js)

//import all the reducers
import changeTheNumber from "./UpDown";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
    changeTheNumber
    // changeTheBackground, .. add other reducers
});

export default rootReducer;