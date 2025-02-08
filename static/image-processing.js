const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const algorithmSelect = document.getElementById('algorithmSelect');
const cellSizeInput = document.getElementById('cellSize');
const shadowSlider = document.getElementById('shadowSlider');
const midtoneSlider = document.getElementById('midtoneSlider');
const highlightSlider = document.getElementById('highlightSlider');

window.originalImageData = null;


imageInput.addEventListener('change', handleImageUpload);
algorithmSelect.addEventListener('change', handleAlgorithmChange);
shadowSlider.addEventListener('input', updateImage);
cellSizeInput.addEventListener('input', handleCellSizeChange);
midtoneSlider.addEventListener('input', updateImage);
highlightSlider.addEventListener('input', updateImage);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, width, height);

      window.originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let filteredData = new ImageData(
          new Uint8ClampedArray(window.originalImageData.data),
          window.originalImageData.width,
          window.originalImageData.height
      );
      applyLevels(filteredData);
      applyDither(filteredData);

      ctx.putImageData(filteredData, 0, 0);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleAlgorithmChange() {
  if (!window.originalImageData) return;

  const imageData = new ImageData(
      new Uint8ClampedArray(window.originalImageData.data),
      window.originalImageData.width,
      window.originalImageData.height
  );
  applyLevels(imageData);
  applyDither(imageData);

  ctx.putImageData(imageData, 0, 0);
}

function handleCellSizeChange() {
  if (!window.originalImageData) return;

  if (cellSizeInput.value === "") return;

  let value = Math.floor(Number(cellSizeInput.value) || 1);

  if (value < Math.max(1, cellSizeInput.min)) {
    value = Math.floor(Math.max(1, cellSizeInput.min));
  } else if (value > cellSizeInput.max) {
    value = Math.floor(cellSizeInput.max);
  } else {
    value = Math.floor(cellSizeInput.value);
  }

  cellSizeInput.value = value;

  updateImage();
}

function updateImage() {
  if (!window.originalImageData) return;

  const imageData = new ImageData(
      new Uint8ClampedArray(window.originalImageData.data),
      window.originalImageData.width,
      window.originalImageData.height
  );
  applyLevels(imageData);
  applyDither(imageData);

  ctx.putImageData(imageData, 0, 0);
}
