import { z } from "zod";

import { normalizePostalCode } from "@/lib/commerce/shipping";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidCpf(value: string) {
  const cpf = digitsOnly(value);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    const sum = cpf
      .slice(0, length)
      .split("")
      .reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === Number(cpf[9]) && calculateDigit(10) === Number(cpf[10]);
}

export const guestCheckoutSchema = z.object({
  productId: z.string().trim().min(1).max(160),
  variantValue: z.string().trim().min(1).max(80).optional(),
  shippingQuoteId: z.number().int().positive(),
  customer: z.object({
    fullName: z.string().trim().min(3).max(120),
    email: z.email().trim().toLowerCase().max(180),
    phone: z.string().transform(digitsOnly).pipe(z.string().min(10).max(11)),
    cpf: z.string().transform(digitsOnly).pipe(z.string().refine(isValidCpf)),
    marketingOptIn: z.boolean().default(false),
  }),
  address: z.object({
    postalCode: z.string().transform(normalizePostalCode).pipe(z.string().length(8)),
    street: z.string().trim().min(2).max(160),
    number: z.string().trim().min(1).max(30),
    complement: z.string().trim().max(100).default(""),
    neighborhood: z.string().trim().min(2).max(100),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().toUpperCase().length(2),
  }),
  compatibilityConfirmed: z.literal(true),
  termsAccepted: z.literal(true),
});

export type GuestCheckoutInput = z.infer<typeof guestCheckoutSchema>;

export function splitCustomerName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);

  return {
    name: parts[0] ?? fullName,
    surname: parts.slice(1).join(" ") || undefined,
  };
}

export function splitPhone(phone: string) {
  const normalized = digitsOnly(phone);

  return {
    areaCode: normalized.slice(0, 2),
    number: normalized.slice(2),
  };
}

export function createPublicOrderId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

  return `IS-${date}-${random}`;
}
