function applyLevels(imageData) {
  const shadow = parseInt(shadowSlider.value);
  const midtone = parseInt(midtoneSlider.value);
  const highlight = parseInt(highlightSlider.value);

  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    let gamma = 1;
    let midtoneNormal = midtone / 255;
    if (midtone < 128) {
        midtoneNormal = midtoneNormal * 2;
        gamma = 1 + (9 * (1 - midtoneNormal))
        gamma = Math.min(gamma, 9.99)
    } else if (midtone > 128) {
        midtoneNormal = (midtoneNormal * 2) - 1;
        gamma = 1 - midtoneNormal;
        gamma = Math.max(gamma, 0.01);
    }
    let gammaCorrection = 1 / gamma;

    r = applyLevelToChannel(r, shadow, midtone, highlight, gammaCorrection);
    g = applyLevelToChannel(g, shadow, midtone, highlight, gammaCorrection);
    b = applyLevelToChannel(b, shadow, midtone, highlight, gammaCorrection);

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

function applyLevelToChannel(value, shadow, midtone, highlight, gammaCorrection) {
  value = 255 * ((value - shadow) / (highlight - shadow));
  if (midtone !== 128) {
      value = 255 * (Math.pow((value / 255), gammaCorrection));
  }
  return Math.min(255, Math.max(0, value));
}