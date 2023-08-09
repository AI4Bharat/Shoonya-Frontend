import C from "../../constants";


export const setPlayer = (data) => {
  return {
    type: C.PLAYER,
    payload: data,
  };
};

