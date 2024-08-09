// mercadopago.d.ts
import 'mercadopago';

declare module 'mercadopago' {
  export interface PreferenceMetadata {
    orderId: string;
    total: number;
    items: {
      id: string;
      quantity: number;
      unit_price: number;
      description: string;
      title: string;
      imageUrl: string | null;
    }[];
  }
}
