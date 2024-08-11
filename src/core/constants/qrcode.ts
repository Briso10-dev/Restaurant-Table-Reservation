// qrcode.ts
import QRCode from "qrcode";

const QRcode = {
    formatData: (data: object) => {
        try {
            const qrCodeText = `${data.reservationID}`;
            return qrCodeText;
        } catch (error) {
            console.error("Error formatting QR code data:", error);
        }
    },
    generateQRCode: async (path: string, qrCodeText: string) => {
        try {
            const qrCodeDataUrl = await QRCode.toFile(path, qrCodeText,
                {errorCorrectionLevel:'H',
                    type:'png',
                    margin:1,
                    width: 256
                });
            return qrCodeDataUrl;
        } catch (error) {
            console.error("Error generating QR code:", error);

        }
    }
}

export default QRcode;