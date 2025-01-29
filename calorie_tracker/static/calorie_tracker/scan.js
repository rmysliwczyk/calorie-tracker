afterScan = undefined;
let html5QrcodeScanner;

function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    scannedBarcode = decodedText;
    document.dispatchEvent(new CustomEvent("barcode-scanned", {detail: {barcode: decodedText}}));
}
  
function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
}

function showScanner(targetDivName)
{    
    html5QrcodeScanner = new Html5QrcodeScanner(
    `${targetDivName}`,
    { fps: 10, qrbox: {width: 250, height: 250} },
    /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}
