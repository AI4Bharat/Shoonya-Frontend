import constants from "../../constants";

export default function (state = {}, action) {
    switch (action.type) {
        
        case constants.GET_ALL_DOMAINS:
          const modifiedData = action.payload?.domains.map((el,i)=>{
            if(el.active){
              return el
            }
          })
            return modifiedData;
        default:
            return state;
    }
}