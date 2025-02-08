const ditherjs = new DitherJS();
const palettes = {
  "paletteRBW": paletteRBW,
  "paletteNES15": paletteNES15,
  "paletteNES54": paletteNES54,
}

function applyDither(imageData) {
  const algorithm = algorithmSelect.value;
  const cellSize = Number(cellSizeInput.value || Math.floor(Math.max(1, cellSizeInput.min)));
  const palette = palettes[paletteSelect.value];

  ditherjs.ditherImageData(imageData, {
    "step": cellSize,
    "algorithm": algorithm,  // Используем выбранный алгоритм
    "palette": palette,
  });
}