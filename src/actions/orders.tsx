// src/actions/orders.tsx
"use client";

import { z } from "zod";
import db from "../db/db"; // Now guaranteed to be initialized
import { Resend } from "resend";
import OrderHistoryEmail from "@/email/OrderHistory";

const emailSchema = z.string().email();

// Initialize Resend instance only on the server
let resend: Resend | null = null;
if (typeof window === "undefined") {
  resend = new Resend(process.env.RESEND_API_KEY as string);
}

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string } | undefined> {
  // Ensure this function only runs on the server
  if (typeof window !== "undefined") {
    return { error: "This action is only available on the server." };
  }

  const result = emailSchema.safeParse(formData.get("email"));
  if (!result.success) return { error: "Invalid email" };

  // Query the database
  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          priceInCents: true,
          createdAt: true,
          product: {
            select: { id: true, name: true, imagePath: true, description: true },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      message: "Check your email to view your order history and download your products.",
    };
  }

  const orders = await Promise.all(
    user.orders.map(async (order) => ({
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours expiry
            productId: order.product.id,
          },
        })
      ).id,
    }))
  );

  const data = await resend!.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Your order history",
    react: <OrderHistoryEmail orders={orders} />,
  });

  if (data.error) {
    return { error: "Failed to send email" };
  }

  return {
    message: "Check your email to view your order history and download your products.",
  };
}
