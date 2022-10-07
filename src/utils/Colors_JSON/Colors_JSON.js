const greenBase = {
    h: "120",
    s: "128%",
    l: "25%"
}

const orangeBase = {
    h: "33",
    s: "100%",
    l: "48%"
}

const generateColor = (baseColor) => {
    // let totalColors = 10;
    let opacityDiff = 0.05;
    let colorArr = [];

    while (opacityDiff <= 1) {
        colorArr.push({
            color: `hsla(${baseColor.h}, ${baseColor.s}, ${baseColor.l}, ${opacityDiff})`
        });
        if(opacityDiff > 0.6){
            opacityDiff +=0.08
        } else {
            opacityDiff += 0.05;
        }
    }

    // for (let index = 0; index < totalColors; index++) {
    //     // const element = array[index];
    //     colorArr.push({
    //         color: `hsla(${baseColor.h}, ${baseColor.s}, ${baseColor.l}, ${opacityDiff})`
    //     })
    //     opacityDiff += 0.1;
    // }

    console.log("colorArr --- ", colorArr);

    return colorArr;
}
const colors = {
    orange: generateColor(orangeBase).reverse(),
    green: generateColor(greenBase).reverse(),
    // orange: [
    //     { color: "#e07b00" },
    //     { color: "#ff930f" },
    //     { color: "#ffa83d" },
    //     { color: "#ffbc6b" },
    //     { color: "#ffca8a" },
    //     { color: "#ffdfb8" },
    //     { color: "#ffa280" },
    //     { color: "#ffc3ad" },
    //     { color: "#ffc65c" },
    //     { color: "#ffd68a" },
    //     { color: "#ffe1a8" },
    //     { color: "#fff6e6" },
    // ],
    // green: [
    //     { color: "#006400" },
    //     { color: "#005700" },
    //     { color: "#138808" },
    //     { color: "#009900" },
    //     { color: "#009e00" },
    //     { color: "#00cc00" },
    //     { color: "#00eb00" },
    //     { color: "#1aff1a" },
    //     { color: "#85ff85" },
    //     { color: "#94ff94" },
    //     { color: "#b3ffb3" },
    //     { color: "#e0ffe0" },
    // ]
};

export default colors;