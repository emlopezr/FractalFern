import values from "./values.js";

let canvas, canvasContext;

const tdCells = document.querySelectorAll("td");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const valueSelector = document.getElementById("fern_type");

const parameters = {
    fps: document.getElementById("fps"),
    radio: document.getElementById("radio"),
    scale_x: document.getElementById("scale_x"),
    scale_y: document.getElementById("scale_y"),
};

let probabilities = [0.01, 0.86, 0.93, 1];
let paused = true;
let x = 0,
    y = 0;

const columnNames = ["a", "b", "c", "d", "e", "f", "p"];
let matrix = {};

// Iterar sobre las celdas <td> y reemplazar su contenido con <input> y guardar su referencia
tdCells.forEach((td, index) => {
    const currentValue = td.textContent.trim();
    const input = document.createElement("input");
    input.type = "number";
    input.id = `f${Math.floor(index / 7) + 1}_${columnNames[index % 7]}`;
    input.value = currentValue;
    td.textContent = "";
    td.appendChild(input);
    matrix[String(input.id)] = input;
});

// Funcionalidad de los botones e inputs
pauseButton.onclick = () => pause();

resetButton.onclick = () => reset();
valueSelector.onchange = () => reset();

// Reiniciar la animación siempre que se cambie el valor de un input
for (let key in matrix) matrix[key].onchange = () => reset(false);
for (let key in parameters) parameters[key].onchange = () => reset(false);

// Reproducir la animación en el canvas
window.onload = function () {
    canvas = document.getElementById("canvas");
    canvasContext = canvas.getContext("2d");

    canvasContext.fillStyle = "#282424";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    setInterval(() => {
        for (let i = 0; i < parameters.fps.value; i++) {
            if (!paused) update();
        }
    }, 1);
};

function update() {
    let formula;
    let nextX, nextY;
    let r = Math.random();

    // Elegir la formula a usar
    if (r < probabilities[0]) formula = "f1";
    else if (r < probabilities[1]) formula = "f2";
    else if (r < probabilities[2]) formula = "f3";
    else formula = "f4";

    // Aplicar la formula
    nextX =
        parseFloat(matrix[`${formula}_a`].value) * x +
        parseFloat(matrix[`${formula}_b`].value) * y +
        parseFloat(matrix[`${formula}_e`].value);

    nextY =
        parseFloat(matrix[`${formula}_c`].value) * x +
        parseFloat(matrix[`${formula}_d`].value) * y +
        parseFloat(matrix[`${formula}_f`].value);

    // Escalado para que se vea bien en el canvas
    let plotX =
        (canvas.width * (x + (19 * parameters.scale_x.value) / 40)) /
        parameters.scale_x.value;

    let plotY =
        canvas.height - canvas.height * ((y + 1) / parameters.scale_y.value);

    // Dibujar el punto
    drawCircle(plotX, plotY, parameters.radio.value, "green");

    // Actualizar las coordenadas
    x = nextX;
    y = nextY;
}
function drawCircle(centerX, centerY, radius, color) {
    canvasContext.beginPath();
    canvasContext.fillStyle = color;
    canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    canvasContext.fill();
}

function reset(resetParams = true) {
    canvasContext.fillStyle = "#282424";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    x = 0;
    y = 0;

    if (resetParams) {
        for (let key in matrix) {
            matrix[key].value = values[valueSelector.value][key];
        }

        parameters.scale_x.value = values[valueSelector.value].scale_x;
        parameters.scale_y.value = values[valueSelector.value].scale_y;
    }

    probabilities = [
        values[valueSelector.value].f1_p,

        values[valueSelector.value].f1_p +
        values[valueSelector.value].f2_p,

        values[valueSelector.value].f1_p +
        values[valueSelector.value].f2_p +
        values[valueSelector.value].f3_p,

        values[valueSelector.value].f1_p +
        values[valueSelector.value].f2_p +
        values[valueSelector.value].f3_p +
        values[valueSelector.value].f4_p,
    ];
}

function pause() {
    paused = !paused;
    pauseButton.innerHTML = paused ? "Reproducir" : "Pausar";
    pauseButton.style = paused
        ? "background-color: #4CAF50;"
        : "background-color: #afa84c;";
}
