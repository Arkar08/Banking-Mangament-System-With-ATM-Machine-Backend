import QRCode from 'qrcode';

const generateQrCode = async (data) => {
  try {
    const qrUrl = await QRCode.toDataURL(data);
    return qrUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export default generateQrCode;