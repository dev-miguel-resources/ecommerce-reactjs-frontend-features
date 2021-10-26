export const headerReducer = (state = false, action) => {
    switch (action.type) {
      case "SET_KEY_ITEM":
        return action.payload;
      default:
        return state;
    }
  };
  