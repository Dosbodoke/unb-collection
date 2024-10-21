import {
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  SearchIcon,
  ShoppingBagIcon,
  TruckIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Database } from '@/utils/supabase/database.types';
import { createClient } from '@/utils/supabase/server';
import { Item } from '@/components/carrinho/_components/item';

type Order = Database['public']['Tables']['order_details']['Row'] & {
  order_items: Array<Database['public']['Tables']['order_items']['Row']>;
};

const statusIcons = {
  approved: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
  shipping: <TruckIcon className="h-5 w-5 text-blue-500" />,
  processing: <PackageIcon className="h-5 w-5 text-yellow-500" />,
  pending: <ClockIcon className="h-5 w-5 text-blue-500" />,
};

const statusText = {
  approved: 'Aprovado',
  shipping: 'Em trânsito',
  processing: 'Em processamento',
  pending: 'Pendente',
};

const statusColors = {
  approved: 'text-green-500',
  shipping: 'text-blue-500',
  processing: 'text-yellow-500',
  pending: 'text-blue-500',
};

const OrderItem = ({ order }: { order: Order }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <div className="flex items-center justify-between mb-4">
      {/* <div className="text-sm text-gray-500">{order.date}</div> */}
      <div className={`flex items-center ${statusColors[order.status]} text-sm`}>
        {statusIcons[order.status]}
        <span className="ml-1 capitalize">{statusText[order.status]}</span>
      </div>
    </div>
    <div className="flex items-start space-x-4">
      {/* <img
        src={order.items[0].image}
        alt={order.items[0].name}
        className="w-20 h-20 object-cover rounded"
      /> */}
      {/* <div className="flex-grow">
        <h3 className="font-medium mb-1">{order.order_items[0].name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {order.items[0].quantity} un. | Cor: {order.items[0].color || 'N/A'}
        </p>
        <p className="text-sm mb-2">{order.seller}</p>
        {order.status === 'pending' && (
          <p className="text-sm text-orange-500">Entrega estimada: {order.estimatedDelivery}</p>
        )}
      </div> */}
    </div>
    <div className="mt-4 flex justify-end items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Ver compra</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
            <DialogDescription>
              Comprado em {new Date(order.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {order.order_items.map((item, index) => (
              <Item key={item.id} item={item} isOrdered />
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center font-semibold">
            <span>Total</span>
            {/* <span>R$ {order.total.toFixed(2)}</span> */}
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary">Comprar novamente</Button>
    </div>
  </div>
);

export default async function Component() {
  const supabase = createClient();
  const { data: orders } = await supabase.from('order_details').select('*, order_items ( * )');

  console.log({ orders });
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filter, setFilter] = useState('all');

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Compras</h1>
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {/* <Input
              type="search"
              placeholder="Buscar"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> */}
        </div>
        <div className="flex items-center space-x-4">
          {/* <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="delivered">Entregues</SelectItem>
                <SelectItem value="shipping">Em trânsito</SelectItem>
                <SelectItem value="processing">Em processamento</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select> */}
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {orders?.length || 0} compras
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBagIcon className="h-5 w-5 text-yellow-400" />
            <span className="font-medium">5 produtos esperam sua opinião</span>
          </div>
          <Button variant="secondary">Opinar</Button>
        </div>
      </div>
      <div className="space-y-6">
        {orders?.map((order) => <OrderItem key={order.id} order={order} />)}
      </div>
    </div>
  );
}
