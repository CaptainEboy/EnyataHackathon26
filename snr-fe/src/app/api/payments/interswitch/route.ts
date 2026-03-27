import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * @fileOverview Server-side endpoint to initialize Interswitch Webpay transactions.
 * Calculates the required SHA512 hash using the official formula.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tierId, isAnnual } = body;

    // 1. Determine Amount in Kobo (NGN)
    let amountKobo = 0; 
    if (tierId === 'tier-pro') amountKobo = isAnnual ? 24000 * 100 : 2900 * 100;
    if (tierId === 'tier-enterprise') amountKobo = isAnnual ? 199000 * 100 : 19900 * 100;

    if (amountKobo === 0) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // 2. Transaction Details from Environment
    const transactionRef = `SN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const merchantCode = process.env.INTERSWITCH_MERCHANT_CODE || 'MX26070';
    const payItemId = process.env.INTERSWITCH_PAY_ITEM_ID || '101';
    const secretKey = process.env.INTERSWITCH_SECRET_KEY || 'demo_key';
    const productId = process.env.INTERSWITCH_PRODUCT_ID || '1';
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/dashboard?payment=success`;

    // 3. Generate SHA512 Hash
    // Official Formula: txn_ref + product_id + pay_item_id + amount + site_redirect_url + secret_key
    const hashString = `${transactionRef}${productId}${payItemId}${amountKobo}${callbackUrl}${secretKey}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({
      url: 'https://newwebpay.qa.interswitchng.com/collections/w/pay', 
      transactionRef,
      merchantCode,
      payItemId,
      amount: amountKobo,
      hash,
      callbackUrl,
      productId
    });

  } catch (error) {
    console.error('Payment initialization failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
