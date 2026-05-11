import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSetting } from "@/lib/settings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const serverKey = await getSetting("midtrans_server_key", "");

    // 1. Verify signature key (recommended by Midtrans)
    const signatureStr = `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`;
    const hash = crypto.createHash('sha512').update(signatureStr).digest('hex');

    if (hash !== body.signature_key) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    console.log(`Payment Webhook received for Order ID: ${orderId} - Status: ${transactionStatus}`);

    // 2. Handle transaction status
    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        // TODO: Handle challenge
      } else if (fraudStatus == 'accept') {
        // TODO: Update order status to PAID
      }
    } else if (transactionStatus == 'settlement') {
      // TODO: Update order status to PAID
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      // TODO: Update order status to FAILED/CANCELLED
    } else if (transactionStatus == 'pending') {
      // TODO: Update order status to PENDING
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
