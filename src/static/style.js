function updateSliderFillEventListener(event) {
    updateSliderFill(event.target);
}

function updateSliderFill(slider) {
    const min = slider.min;
    const max = slider.max;
    const value = slider.value;
    const zero_point = slider.dataset.zero_point;
    const zero_percent = zero_point / (max - min) * 100;
    const percent = ((value - min) / (max - min)) * 100;

    slider.style.setProperty("--fill-start", `${Math.min(percent, zero_percent)}%`);
    slider.style.setProperty("--fill-end", `${Math.max(percent, zero_percent)}%`);
}


midtoneSlider.addEventListener("input", updateSliderFillEventListener);
updateSliderFill(midtoneSlider);


shadowSlider.addEventListener("input", updateSliderFillEventListener);
updateSliderFill(shadowSlider);


highlightSlider.addEventListener("input", updateSliderFillEventListener);
updateSliderFill(highlightSlider);