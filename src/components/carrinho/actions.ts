'use server';

import { MercadoPagoConfig, Preference, type PreferenceMetadata } from 'mercadopago';

import type { OrderData } from './index';

export const createPreference = async ({
  orderData,
  hostUrl,
}: {
  orderData: OrderData;
  hostUrl: string;
}): Promise<
  | {
      success: true;
      preferenceId: string;
    }
  | { success: false }
> => {
  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
  });

  const preference = new Preference(client);

  const res = await preference.create({
    body: {
      auto_return: 'approved',
      back_urls: {
        success: `${hostUrl}/pedido`,
        failure: `${hostUrl}/pedido`,
        pending: `${hostUrl}/pedido`,
      },
      binary_mode: true, // Order can only be `approved` or `rejected`, this option removes pending orders
      notification_url: `${hostUrl}/api/ipn`,
      statement_descriptor: 'UNB COLLECTION', // Up to 16 characters
      payment_methods: {
        excluded_payment_methods: [
          {
            id: 'bolbradesco',
          },
          {
            id: 'pec',
          },
        ],
        excluded_payment_types: [
          {
            id: 'debit_card',
          },
        ],
        installments: 6,
      },
      shipments: {
        mode: 'not_specified',
        free_shipping: false,
      },
      items: orderData.items.map((item) => ({ ...item, category_id: 'fashion' })),
      metadata: {
        orderId: orderData.orderId,
        total: orderData.totalValue,
        items: orderData.items,
      } satisfies PreferenceMetadata,
    },
  });

  if (res.id) {
    return { success: true, preferenceId: res.id };
  }

  return { success: false };
};

export const getPreference = async (preferenceId: string) => {
  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
  });
  const preference = new Preference(client);

  const res = await preference.get({ preferenceId });

  if (res.metadata) {
    return res.metadata as PreferenceMetadata;
  }

  return null;
};
