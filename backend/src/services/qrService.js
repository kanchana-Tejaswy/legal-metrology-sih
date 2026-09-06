import QRCode from 'qrcode';

export const qrService = {
  /**
   * Generates a base64 Data URL for the QR code pointing to live verification URL
   * @param {string} certificateId
   * @param {string} baseUrl
   * @returns {Promise<string>} Data URL
   */
  async generateVerificationQR(certificateId, baseUrl = '') {
    const targetUrl = baseUrl ? `${baseUrl}/verify/${certificateId}` : `/verify/${certificateId}`;
    try {
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        width: 300,
        color: {
          dark: '#002147', // Deep Government Navy
          light: '#FFFFFF'
        }
      });
      return dataUrl;
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
      throw new Error('QR Code generation failed');
    }
  }
};
