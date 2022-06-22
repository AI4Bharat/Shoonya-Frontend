export function authenticateUser() {
  const access_token = localStorage.getItem("shoonya_access_token");
  if (access_token) {
    return true;
  } else {
    return false;
  }
}

export function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export function snakeToTitleCase(str) {
    return str.split("_").map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
}