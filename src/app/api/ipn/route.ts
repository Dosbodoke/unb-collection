// Mercado Pago documentation: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/ipn

import { MercadoPagoConfig, MerchantOrder, Preference, type PreferenceMetadata } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

type Topic = 'payment' | 'chargebacks' | 'merchant_order' | 'point_integration_ipn';

export async function POST(req: NextRequest) {
  try {
    // Instantiate clent instances
    const supabase = createClient();
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
    });
    const preferenceClient = new Preference(client);
    const merchantOrderClient = new MerchantOrder(client);

    // Extract the 'topic' from the search parameters
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic') as Topic | null;
    const id = searchParams.get('id');

    if (!id || !topic) {
      console.error('Missing required parameters: id or topic');
      return NextResponse.json({ message: 'Bad Request: Missing parameters' }, { status: 400 });
    }

    // Handle logic for 'merchant_order' notification
    if (topic === 'merchant_order') {
      const merchantOrder = await merchantOrderClient.get({ merchantOrderId: id });

      if (!merchantOrder || !merchantOrder.preference_id) {
        console.error(`Error on merchant order with id ${id}`);
        return NextResponse.json(
          { message: `Error on merchant order with id ${id}` },
          { status: 404 },
        );
      }

      const preference = await preferenceClient.get({
        preferenceId: merchantOrder.preference_id,
      });

      if (!preference || !preference.metadata) {
        console.error('Preference or metadata not found:', merchantOrder.preference_id);
        return NextResponse.json({ message: 'Preference or metadata not found' }, { status: 404 });
      }

      const orderId = (preference.metadata as PreferenceMetadata).orderId;

      // Define order status
      let orderStatus;
      let paidAmount = 0;
      let hasRejectedPayments = false;
      if (merchantOrder.payments) {
        for (const payment of merchantOrder.payments) {
          if (payment.status === 'approved' && payment.transaction_amount) {
            paidAmount += payment.transaction_amount;
          } else if (payment.status === 'rejected') {
            hasRejectedPayments = true;
          }
        }
      }
      if (merchantOrder.total_amount && paidAmount >= merchantOrder.total_amount) {
        orderStatus = 'approved';
      } else if (
        hasRejectedPayments &&
        merchantOrder.total_amount &&
        paidAmount < merchantOrder.total_amount
      ) {
        orderStatus = 'rejected';
      }

      // Update database order status
      if (orderStatus) {
        const { error } = await supabase
          .from('order_details')
          .update({ status: orderStatus })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order status in database:', error);
          return NextResponse.json({ message: 'Database update error' }, { status: 500 });
        }
      }
    }

    // Acknowledge notification
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error processing IPN notification:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
