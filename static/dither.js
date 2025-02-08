const palette = [
  [255, 255, 255], // Белый
  [0, 0, 0],       // Чёрный
  [255, 0, 0]      // Красный
];
const ditherjs = new DitherJS();

function applyDither(imageData) {
  const algorithm = algorithmSelect.value;

  ditherjs.ditherImageData(imageData, {
    "step": 1,
    "algorithm": algorithm,  // Используем выбранный алгоритм
    "palette": palette,
  });
}