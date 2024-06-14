import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "TÊNIS COM VOLUMESNADJKASNDKJSANDKJASNDKJASNDJNASD",
    price: 279.0,
    imageUrl: "path_to_image1",
  },
  {
    id: 2,
    name: "TÊNIS COM VOLUME DE CANO ALTO OLD SCHOOOL",
    price: 279.0,
    imageUrl: "path_to_image2",
  },
  {
    id: 3,
    name: "SAPATO COM VOLUME",
    price: 379.0,
    imageUrl: "path_to_image3",
  },
  {
    id: 4,
    name: "TÊNIS MONOCROMÁTICO",
    price: 259.0,
    imageUrl: "path_to_image4",
  },
  {
    id: 5,
    name: "SAPATO COM VOLUME",
    price: 379.0,
    imageUrl: "path_to_image5",
  },
  {
    id: 6,
    name: "TÊNIS MONOCROMÁTICO",
    price: 259.0,
    imageUrl: "path_to_image6",
  },
  {
    id: 7,
    name: "SAPATO COM VOLUME",
    price: 379.0,
    imageUrl: "path_to_image5",
  },
  {
    id: 8,
    name: "TÊNIS MONOCROMÁTICO",
    price: 259.0,
    imageUrl: "path_to_image6",
  },
  {
    id: 9,
    name: "SAPATO COM VOLUME",
    price: 379.0,
    imageUrl: "path_to_image5",
  },
  {
    id: 10,
    name: "TÊNIS MONOCROMÁTICO",
    price: 259.0,
    imageUrl: "path_to_image6",
  },
  {
    id: 11,
    name: "SAPATO COM VOLUME",
    price: 379.0,
    imageUrl: "path_to_image5",
  },
  {
    id: 12,
    name: "TÊNIS MONOCROMÁTICO",
    price: 259.0,
    imageUrl: "path_to_image6",
  },
];

const ProductGrid = () => {
  return (
    <ul className="grid max-w-6xl mx-auto sm:grid-cols-4 grid-cols-2 border border-black gap-[1px] bg-black">
      {products.map((product, index) => (
        <li
          key={product.id}
          className="p-2 flex flex-col items-center bg-white"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="mb-2 w-full"
          />
          <div className="w-full mt-auto">
            <h3 className="text-sm truncate">{product.name}</h3>
            <p className="text-gray-500">R$ {product.price.toFixed(2)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export { ProductGrid };
