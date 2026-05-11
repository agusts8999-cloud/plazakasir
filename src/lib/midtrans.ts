import midtransClient from 'midtrans-client';
import { getSetting } from './settings';

export async function getMidtransClient() {
  const isProduction = await getSetting("midtrans_is_production", "false") === "true";
  const serverKey = await getSetting("midtrans_server_key", "");
  const clientKey = await getSetting("midtrans_client_key", "");

  if (!serverKey || !clientKey) {
    throw new Error("Midtrans keys are not configured in settings.");
  }

  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey
  });
}

export async function createTransaction(orderId: string, amount: number, customerDetails: any) {
  const snap = await getMidtransClient();
  
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: customerDetails,
    credit_card: {
      secure: true,
    },
  };

  const transaction = await snap.createTransaction(parameter);
  return transaction;
}
