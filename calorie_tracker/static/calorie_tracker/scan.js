afterScan = undefined;
scannedBarcode = "";

function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    scannedBarcode = decodedText;
    afterScan();
}
  
function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
}

function showScanner(targetDivName)
{    
    let html5QrcodeScanner = new Html5QrcodeScanner(
    `${targetDivName}`,
    { fps: 10, qrbox: {width: 250, height: 250} },
    /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}