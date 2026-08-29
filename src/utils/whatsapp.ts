/**
 * WhatsApp Integration Utility for MS Home Trends
 * Click-to-Chat pre-filled message generator & URL builder
 */

export const STORE_PHONE_DISPLAY = '+92 324 2303895';
export const STORE_PHONE_RAW = '923242303895';

export const getStoreWhatsAppNumber = (): string => {
  const metaEnv = (import.meta as any).env;
  const processEnv = typeof process !== 'undefined' ? process.env : {};
  const envNumber =
    metaEnv?.VITE_STORE_WHATSAPP_NUMBER ||
    processEnv?.VITE_STORE_WHATSAPP_NUMBER ||
    STORE_PHONE_RAW;
  // Strip non-digit characters
  return envNumber.replace(/[^0-9]/g, '') || STORE_PHONE_RAW;
};

export interface WhatsAppMessageParams {
  orderId: string;
  invoiceUrl: string;
  amount?: number;
  customerName?: string;
}

/**
 * Builds direct WhatsApp contact URL with custom inquiry message
 */
export const buildWhatsAppContactUrl = (message?: string): string => {
  const storePhone = getStoreWhatsAppNumber();
  const rawMessage = message || 'Assalamu Alaikum MS Home Trends! I would like to inquire about your luxury tableware collections.';
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(rawMessage)}`;
};

/**
 * Builds the WhatsApp Click-to-Chat URL for sending invoice & transfer proof screenshot
 */
export const buildWhatsAppInvoiceAndPaymentProofUrl = ({
  orderId,
  invoiceUrl,
  amount = 0,
  customerName,
}: WhatsAppMessageParams): string => {
  const storePhone = getStoreWhatsAppNumber();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullInvoiceUrl = invoiceUrl.startsWith('http') ? invoiceUrl : `${origin}${invoiceUrl}`;
  const safeAmount = Number(amount) || 0;
  const nameStr = customerName ? ` (${customerName})` : '';

  const rawMessage = `Assalamu Alaikum MS Home Trends! 🧾\n\nI have placed Order #${orderId}${nameStr}.\nTotal Bill Amount: Rs. ${safeAmount.toLocaleString()}\nBill / Invoice Link: ${fullInvoiceUrl}\n\nPlease find my payment transfer screenshot attached for confirmation. Thank you!`;
  const encodedMessage = encodeURIComponent(rawMessage);

  return `https://wa.me/${storePhone}?text=${encodedMessage}`;
};

/**
 * Builds the WhatsApp Click-to-Chat URL for order payment inquiry
 */
export const buildWhatsAppOrderMessageUrl = ({
  orderId,
  invoiceUrl,
  amount = 0,
  customerName,
}: WhatsAppMessageParams): string => {
  return buildWhatsAppInvoiceAndPaymentProofUrl({ orderId, invoiceUrl, amount, customerName });
};

/**
 * Builds the WhatsApp confirmation message URL sent to customer
 */
export const buildWhatsAppConfirmationMessageUrl = ({
  orderId,
  amount = 0,
}: WhatsAppMessageParams): string => {
  const storePhone = getStoreWhatsAppNumber();
  const safeAmount = Number(amount) || 0;
  const rawMessage = `🎉 Your MS Home Trends order #${orderId} has been confirmed. Total Bill: Rs. ${safeAmount.toLocaleString()}. Thank you for shopping with us!`;
  const encodedMessage = encodeURIComponent(rawMessage);

  return `https://wa.me/${storePhone}?text=${encodedMessage}`;
};

/**
 * Opens WhatsApp in a new tab for the given order ID and invoice URL
 */
export const openWhatsAppOrderChat = (orderId: string, invoiceUrl: string, amount?: number, customerName?: string): void => {
  const url = buildWhatsAppInvoiceAndPaymentProofUrl({ orderId, invoiceUrl, amount, customerName });
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
