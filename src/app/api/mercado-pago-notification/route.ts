// Mercado Pago documentation: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

import crypto from 'crypto';
import { MercadoPagoConfig, Payment, type PreferenceMetadata } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  // Instantiate clent instances
  const supabase = createClient();
  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
  });
  const paymentClient = new Payment(client);

  try {
    // Extract the signature and body from the request
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);

    validateNotificationOrigin({
      dataId: searchParams.get('data.id'),
      xRequestId: req.headers.get('x-request-id'),
      xSignature: req.headers.get('x-signature'),
    });

    const rawBody = await req.text();
    // Parse the JSON body
    const { id: paymentId } = JSON.parse(rawBody);

    // Fetch the payment details from MercadoPago
    const payment = await paymentClient.get(paymentId);
    const orderId = (payment.metadata as PreferenceMetadata)?.orderId;
    const paymentStatus = payment.status;

    // Update database order status
    if (paymentStatus && orderId) {
      const statuses = {
        approved: ['approved'],
        pending: ['pending', 'authorized', 'in_process', 'in_mediation'],
        refused: ['rejected', 'cancelled', 'refunded', 'charged_back'],
      };

      // Get the key of "statuses" where the value includes payment.status
      const orderStatus = Object.keys(statuses).find((key) =>
        statuses[key as keyof typeof statuses].includes(paymentStatus),
      );

      const { error } = await supabase
        .from('order_details')
        .update({ status: orderStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status in database:', error);
        return NextResponse.json({ message: 'Database update error' }, { status: 500 });
      }
    }

    // Acknowledge notification
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error processing WEBHOOK notification:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

function validateNotificationOrigin({
  dataId,
  xRequestId,
  xSignature,
}: {
  dataId: string | null;
  xRequestId: string | null;
  xSignature: string | null;
}) {
  const secret = process.env.MERCADO_PAGO_SECRET;
  if (!dataId || !xRequestId || !xSignature || !secret) {
    console.log('Invalid arguments for HMAC validation');
    throw new Error('Invalid arguments for HMAC validation');
  }

  // Initialize variables to store ts and hash
  let ts = '';
  let hash = '';

  // Separate the x-signature into parts
  const parts = xSignature.split(',');

  // Iterate over the values to obtain ts and v1
  parts.forEach((part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey === 'ts') {
        ts = trimmedValue;
      } else if (trimmedKey === 'v1') {
        hash = trimmedValue;
      }
    }
  });

  // Generate the manifest string
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  // Create an HMAC signature
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);

  // Obtain the hash result as a hexadecimal string
  const sha = hmac.digest('hex');

  // Verify the HMAC signature
  if (sha !== hash) {
    console.log('HMAC verification failed');
    throw new Error('HMAC verification failed');
  }
}
