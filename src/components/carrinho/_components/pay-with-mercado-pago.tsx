'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import React, { useEffect, useState } from 'react';

import { createPreference } from '@/components/carrinho/actions';
import { useCartStore } from '@/stores/cart-store';

const PayWithMercadoPago = () => {
  const { cart } = useCartStore();
  const [componentLoaded, setcomponentLoaded] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    setcomponentLoaded(true);
  }, []);

  useEffect(() => {
    async function getPreferenceID() {
      if (cart.length === 0) return;
      const res = await createPreference({
        hostUrl: window.location.origin,
        orderData: cart.map((item) => ({
          id: item.product_sku.id.toString(),
          title: item.product_sku.product.name,
          unit_price: item.product_sku.price,
          quantity: item.quantity,
          description: '',
          category_id: 'fashion',
        })),
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
  }, [cart, componentLoaded]);

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
