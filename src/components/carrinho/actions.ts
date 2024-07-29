'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';

export const createPreference = async ({
  orderData,
  hostUrl,
}: {
  orderData: {
    id: string;
    quantity: number;
    unit_price: number;
    description: string;
    title: string;
  }[];
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
      statement_descriptor: 'UNB COLLECTION',
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
      items: orderData,
    },
  });

  if (res.id) {
    return { success: true, preferenceId: res.id };
  }

  return { success: false };
};
