import QRCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';

const generateQrCode = async (data) => {
  try {
    const qrUrl = await QRCode.toDataURL(data);
     const uploadResponse = await cloudinary.uploader.upload(qrUrl, {
      folder: 'my_uploads',
    });
    return uploadResponse.url;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export default generateQrCode;