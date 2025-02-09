let device, server, service, characteristic;
const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); // Измените на ваш UUID сервиса
const CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(); // Измените на ваш UUID характеристики

const bleConnectBtn = document.getElementById('bleConnect');
const bleSendBtn = document.getElementById('bleSend');
const bleStatusBadge = document.getElementById('bleStatusBadge');


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

    let byteArray = new Uint8Array([1, 2, 3, 4, 5]); // Пример байтового массива

    let oldBtnCaption = bleSendBtn.textContent;
    bleSendBtn.disabled = true;
    try {
        await characteristic.writeValue(byteArray);
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