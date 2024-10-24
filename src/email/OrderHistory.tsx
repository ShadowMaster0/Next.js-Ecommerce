import React from "react";
import {
  Html,
  Preview,
  Tailwind,
  Body,
  Head,
  Container,
  Heading,
  Hr,
} from "@react-email/components";
import { OrderInformation } from "../email/components/OrderInformation";

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    priceInCents: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: {
      name: string;
      imagePath: string;
      description: string;
    };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      priceInCents: 1000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product Name",
        description: "Product Description",
        imagePath: "/products/bike.jpg",
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      priceInCents: 2000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product Name 2",
        description: "Product Description too much",
        imagePath: "/products/bike.jpg",
      },
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />

        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={index}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
