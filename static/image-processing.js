const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const algorithmSelect = document.getElementById('algorithmSelect');
const shadowSlider = document.getElementById('shadowSlider');
const midtoneSlider = document.getElementById('midtoneSlider');
const highlightSlider = document.getElementById('highlightSlider');

window.originalImageData = null;

imageInput.addEventListener('change', handleImageUpload);
algorithmSelect.addEventListener('change', handleAlgorithmChange);
shadowSlider.addEventListener('input', updateImage);
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
