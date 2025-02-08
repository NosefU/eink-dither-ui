const palette = [
  [255, 255, 255], // Белый
  [0, 0, 0],       // Чёрный
  [255, 0, 0]      // Красный
];
const ditherjs = new DitherJS();

function applyDither(imageData) {
  const algorithm = algorithmSelect.value;
  const cellSize = Number(cellSizeInput.value || Math.floor(Math.max(1, cellSizeInput.min)));

  ditherjs.ditherImageData(imageData, {
    "step": cellSize,
    "algorithm": algorithm,  // Используем выбранный алгоритм
    "palette": palette,
  });
}