let device, server, service, characteristic;
const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); // Измените на ваш UUID сервиса
const CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); // Измените на ваш UUID характеристики

const bleConnectBtn = document.getElementById('bleConnect');
const bleSendBtn = document.getElementById('bleSend');
const bleStatusBadge = document.getElementById('bleStatusBadge');


const bleSendPBContainer = document.getElementById('bleSendPBContainer');
const bleSendProgressBar = document.getElementById('bleSendProgressBar');


if (!('bluetooth' in navigator)) {
    clearClasses(bleStatusBadge, 'text-bg-');
    bleStatusBadge.classList.add('text-bg-danger');
    bleStatusBadge.textContent = `Browser does not support Bluetooth API`;
    bleConnectBtn.disabled = true;
}

bleConnectBtn.addEventListener('click', async () => {
    if (device && device.gatt.connected) {
        device.gatt.disconnect();
        bleConnectBtn.classList.remove('btn-danger');
        bleConnectBtn.classList.add('btn-primary');
        bleConnectBtn.textContent = `Connect`;

        clearClasses(bleStatusBadge, 'text-bg-');
        bleStatusBadge.classList.add('text-bg-danger');
        bleStatusBadge.textContent = `Disconnected`;

        bleSendBtn.disabled = true;
        return;
    }

    try {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [SERVICE_UUID]
        });

        clearClasses(bleStatusBadge, 'text-bg-');
        bleStatusBadge.classList.add('text-bg-primary');
        bleStatusBadge.textContent = `Connecting...`;

        server = await device.gatt.connect();
        service = await server.getPrimaryService(SERVICE_UUID);
        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        bleConnectBtn.textContent = `Disconnnect`;
        bleConnectBtn.classList.remove('btn-primary');
        bleConnectBtn.classList.add('btn-danger');

        clearClasses(bleStatusBadge, 'text-bg-');
        bleStatusBadge.classList.add('text-bg-success');
        bleStatusBadge.textContent = device.name;

        bleSendBtn.disabled = false;
    } catch (error) {
        console.error(error);

        clearClasses(bleStatusBadge, 'text-bg-');
        bleStatusBadge.classList.add('text-bg-danger');
        bleStatusBadge.textContent = 'Connection error';
    }
});

bleSendBtn.addEventListener('click', async () => {
    if (!characteristic) return;
    if (!canvas || !window.originalImageData) return;

    const { blackBits, redBits } = getBitArraysFromCanvas(canvas);

    let oldBtnCaption = bleSendBtn.textContent;
    bleSendBtn.disabled = true;
    try {
        const chunkSize = 495;  // Максимальный размер пакета

        bleSendPBContainer.classList.remove('d-none');

        let reversedBlack = new Uint8Array(blackBits.length);
        for (let i = 0; i < blackBits.length; i++) {
            reversedBlack[i] = reverseBits(blackBits[i]);
        }
        let reversedRed = new Uint8Array(redBits.length);
        for (let i = 0; i < redBits.length; i++) {
            reversedRed[i] = reverseBits(redBits[i]);
        }

        for (let i = 0; i < reversedBlack.length; i += chunkSize) {
            let percent = Math.ceil(i / (reversedBlack.length + reversedRed.length) * 100);
            bleSendPBContainer.ariaValueNow = "" + percent;
            bleSendProgressBar.style.width = `${percent}%`;
            bleSendProgressBar.textContent = `${percent}%`;

            let chunk = reversedBlack.slice(i, i + chunkSize);
            await characteristic.writeValue(chunk);
        }

        for (let i = 0; i < reversedRed.length; i += chunkSize) {
            let percent = Math.ceil((i + reversedBlack.length) / (reversedBlack.length + reversedRed.length) * 100);
            bleSendPBContainer.ariaValueNow = "" + percent;
            bleSendProgressBar.style.width = `${percent}%`;
            bleSendProgressBar.textContent = `${percent}%`;

            let chunk = reversedRed.slice(i, i + chunkSize);
            await characteristic.writeValue(chunk);
        }

        bleSendPBContainer.classList.add('d-none');

        bleSendBtn.textContent = '✅ Image sent';
        setTimeout(function() {
            bleSendBtn.textContent = oldBtnCaption;
            bleSendBtn.disabled = false;
        }, 1000);
    } catch (error) {
        console.error(error);
        bleSendBtn.textContent = '❌ Image sending error';
        setTimeout(function() {
            bleSendBtn.textContent = oldBtnCaption;
            bleSendBtn.disabled = false;
        }, 1000);
    }

});


function clearClasses(node, prefix) {
    node.classList.forEach(className => {
        if (className.startsWith(prefix)) {
            node.classList.remove(className);
        }
    });
}


function getBitArraysFromCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height).data;

    const blackBits = new Uint8Array(Math.ceil((width * height) / 8));
    const redBits = new Uint8Array(Math.ceil((width * height) / 8));

    for (let i = 0; i < width * height; i++) {
        const index = i * 4;
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];

        const bitIndex = i % 8;
        const byteIndex = Math.floor(i / 8);

        if (r === 0 && g === 0 && b === 0) {
            blackBits[byteIndex] |= (1 << bitIndex);
        }

        if (r > 128 && g < 64 && b < 64) {
            redBits[byteIndex] |= (1 << bitIndex);
        }
    }

    return { blackBits, redBits };
}

function reverseBits(byte) {
    let reversed = 0;
    for (let i = 0; i < 8; i++) {
        reversed = (reversed << 1) | (byte & 1);
        byte >>= 1;
    }
    return reversed;
}