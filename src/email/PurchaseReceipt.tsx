import React from "react";
import {
  Html,
  Preview,
  Tailwind,
  Body,
  Head,
  Container,
  Heading,
} from "@react-email/components";
import { OrderInformation } from "../email/components/OrderInformation";

type PurchaseReceiptEmailProps = {
  product: {
    name: string;
    imagePath: string
    description: string;
  };
  order: { id: string; createdAt: Date; priceInCents: number };
  downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
  product: { name: "Product Name", 
    description: "Product Description",
    imagePath: "/products/bike.jpg" },
  
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    priceInCents: 1000,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />

        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
