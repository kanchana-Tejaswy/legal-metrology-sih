import crypto from 'crypto';
import { qrService } from './qrService.js';

export const certificateService = {
  /**
   * Generates certificate record data
   */
  async generateCertificateData({
    verificationRecord,
    instrument,
    owner,
    verifier,
    category
  }) {
    const verificationDate = new Date();
    const cycleMonths = category?.verification_cycle_months || 12;

    const validUntilDate = new Date(verificationDate);
    validUntilDate.setMonth(validUntilDate.getMonth() + cycleMonths);
    validUntilDate.setDate(validUntilDate.getDate() - 1); // 1 year minus 1 day

    const verDateStr = verificationDate.toISOString().split('T')[0];
    const validUntilStr = validUntilDate.toISOString().split('T')[0];

    // Compute digital signature digest
    const payload = `${instrument.id}:${instrument.serial_number}:${verifier.id}:${verDateStr}:${validUntilStr}`;
    const digitalSignatureHash = 'SHA256:' + crypto.createHash('sha256').update(payload).digest('hex');

    const authorityName = verifier.role === 'GATC'
      ? `Government Approved Test Centre (Accredited under Legal Metrology Act)`
      : `Office of Inspector of Legal Metrology, Department of Consumer Affairs`;

    return {
      verification_record_id: verificationRecord.id,
      instrument_id: instrument.id,
      owner_id: owner.id,
      verifier_id: verifier.id,
      verifying_authority: authorityName,
      verifier_name: verifier.full_name,
      verification_date: verDateStr,
      valid_until: validUntilStr,
      digital_signature_hash: digitalSignatureHash
    };
  }
};
