'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import React, { useEffect, useState } from 'react';

import { createPreference } from '@/components/carrinho/actions';

import type { OrderData } from '../index';

const PayWithMercadoPago = ({ orderData }: { orderData: OrderData }) => {
  const [componentLoaded, setcomponentLoaded] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    setcomponentLoaded(true);
  }, []);

  useEffect(() => {
    async function getPreferenceID() {
      if (!orderData) return;
      const res = await createPreference({
        hostUrl: window.location.origin,
        orderData,
      });

      if (res.success) {
        setPreferenceId(res.preferenceId);
      }
    }

    if (componentLoaded) {
      initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_API_KEY as string, {
        locale: 'pt-BR',
      });
      getPreferenceID();
    }
  }, [orderData, componentLoaded]);

  return preferenceId ? (
    <Wallet
      key="mercado-pago"
      initialization={{ preferenceId }}
      locale="pt-BR"
      brand="UNB Collection"
    />
  ) : null;
};

export { PayWithMercadoPago };
