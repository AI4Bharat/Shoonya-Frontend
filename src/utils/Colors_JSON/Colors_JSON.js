// const greenBase = {
//     h: "120",
//     s: "128%",
//     l: "25%"
// }

// const orangeBase = {
//     h: "33",
//     s: "100%",
//     l: "48%"
// }

// const generateColor = (baseColor) => {
//     // let totalColors = 10;
//     let opacityDiff = 0.05;
//     let colorArr = [];

//     while (opacityDiff <= 1) {
//         colorArr.push({
//             color: `hsla(${baseColor.h}, ${baseColor.s}, ${baseColor.l}, ${opacityDiff})`
//         });
//         if(opacityDiff > 0.6){
//             opacityDiff +=0.08
//         } else {
//             opacityDiff += 0.05;
//         }
//     }

// for (let index = 0; index < totalColors; index++) {
//     // const element = array[index];
//     colorArr.push({
//         color: `hsla(${baseColor.h}, ${baseColor.s}, ${baseColor.l}, ${opacityDiff})`
//     })
//     opacityDiff += 0.1;
// }

//     console.log("colorArr --- ", colorArr);

//     return colorArr;
// }

const greenColorCodeArr = [
    "#003b00", "#006200", "#008900", "#00b100", "#00ff00", "#4eff4e", "#9dff9d", "#c4ffc4", 
    "#226745", "#2c8458", "#36a26c", "#40bf80", "#5dc993", "#7bd3a7", "#98ddba", "#b5e6ce", 
    "#00896e", "#00b18d", "#00d8ad", "#00ffcc", "#76ffe4", "#9dffeb", "#c4fff3", "#bbff76", 
    "#00b176", "#00d890", "#00ffaa", "#27ffb7", "#76ffd1", "#9dffde", "#c4ffeb", "#ebfff8", 
    "#ebfff8", "#476a6a", "#568181", "#669999", "#7ea9a9", "#95b8b8", "#c4d8d8", "#dce7e7", 
    "#dce7e7", "#1b6e6e", "#238d8d", "#2badad", "#33cccc", "#52d4d4", "#91e4e4", "#b1ebeb", 
    "#d0f3f3", "#486969", "#7fa7a7", "#aec7c7", "#c5d7d7"
];
const orangeColorCodeArr = [
    "#b14700", "#d85600", "#ff6600", "#ff7e27", "#ff954e", "#ffad76", "#ffc49d", "#ffdcc4", 
    "#d86c00", "#ff8000", "#ff9427", "#ffa74e", "#ffbb76", "#ffce9d", "#ffe2c4", "#ca935c", 
    "#deba97", "#d84800", "#ff5500", "#ff6f27", "#ff894e", "#ffa376", "#ffbe9d", "#ffd8c4", 
    "#b10000", "#ff0000", "#ff4e4e", "#ff7676", "#ff9d9d", "#ffc4c4", "#ffc4c4", "#ffc4c4", 
    "#ffc4c4", "#ffda76", "#ffe59d", "#ffefc4", "#b16a00", "#d88100", "#ff9900", "#ffb84e", 
    "#ffc876", "#890037", "#b10047", "#d80056", "#ff0066", "#ff4e95", "#ff76ad", "#ff9dc4", 
    "#620034", "#620034", "#ff4ef9", "#ff76fb", "#ff9dfc", "#ffc4fd", 
];

const colors = {
    orange: orangeColorCodeArr.map(el=>{
        return {color: el}
    }),
    green: greenColorCodeArr.map(el=>{
        return {color: el}
    })
    // orange: generateColor(orangeBase).reverse(),
    // green: generateColor(greenBase).reverse(),
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