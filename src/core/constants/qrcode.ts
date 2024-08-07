// qrcode.ts
import QRCode from "qrcode";

const QRcode = {
    formatData: (data: object) => {
        try {
            const qrCodeText = `Reservation ID: ${data.reservationID}, User ID: ${data.user_id}, Table ID: ${data.table_id}, Date: ${data.dateReservation}, Time: ${data.hourReservation}`;
            return qrCodeText;
        } catch (error) {
            console.error("Error formatting QR code data:", error);
        }
    },
    generateQRCode: async (qrCodeText: string) => {
        try {
            const options = {
                errorCorrectionLevel: 'H',
                type: 'png',
                quality: 1,
                margin: 1,
                width: 256,
            };
            const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText, options);
            return qrCodeDataUrl;
        } catch (error) {
            console.error("Error generating QR code:", error);
            
        }
    }
}

export default QRcode;