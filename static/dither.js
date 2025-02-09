const ditherjs = new DitherJS();
const palettes = {
  "paletteRBW": paletteRBW,
  "paletteGBDMG01": paletteGBDMG01,
  "paletteCGA4": paletteCGA4,
  "paletteNES15": paletteNES15,
  "paletteNES54": paletteNES54,
}

function applyDither(imageData) {
  const algorithm = algorithmSelect.value;
  if (algorithm === "null") return reducePalette(imageData);

  const cellSize = Number(cellSizeInput.value || Math.floor(Math.max(1, cellSizeInput.min)));
  const palette = palettes[paletteSelect.value];

  ditherjs.ditherImageData(imageData, {
    "step": cellSize,
    "algorithm": algorithm,  // Используем выбранный алгоритм
    "palette": palette,
  });
}


function reducePalette(imageData) {
  const palette = palettes[paletteSelect.value];
  const data = imageData.data;

  // Функция для нахождения ближайшего цвета в заданной палитре
  function findClosestColor(color, palette) {
    let minDist = Infinity;
    let closestColor = palette[0];

    for (let i = 0; i < palette.length; i++) {
      let dist = Math.pow(color[0] - palette[i][0], 2) +
          Math.pow(color[1] - palette[i][1], 2) +
          Math.pow(color[2] - palette[i][2], 2);
      if (dist < minDist) {
        minDist = dist;
        closestColor = palette[i];
      }
    }
    return closestColor;
  }

  // Применяем новую палитру к изображению
  for (let i = 0; i < data.length; i += 4) {
    let newColor = findClosestColor([data[i], data[i + 1], data[i + 2]], palette);
    data[i] = newColor[0];
    data[i + 1] = newColor[1];
    data[i + 2] = newColor[2];
  }

  ctx.putImageData(imageData, 0, 0);
}