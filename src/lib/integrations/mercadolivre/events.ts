import "server-only";

import { getMercadoLivreItem, getMercadoLivreOrder } from "./client";
import type { MercadoLivreNotification } from "./store";
import { getMercadoLivreAccessToken } from "./store";
import { saveMercadoLivreItems, saveMercadoLivreOrders } from "./syncStore";

type EventResult = { kind: "item" | "order" | "ignored"; resourceId?: string };

function resourcePath(resource: string) {
  return resource.split("?", 1)[0].replace(/\/$/, "");
}

export async function processMercadoLivreNotification(
  notification: MercadoLivreNotification,
): Promise<EventResult> {
  const path = resourcePath(notification.resource);
  const itemMatch = path.match(/^\/items\/([A-Z]{3}\d+)$/);
  const orderMatch = path.match(/^\/orders\/(\d+)$/);
  if (notification.topic === "items" && itemMatch) {
    const accessToken = await getMercadoLivreAccessToken();
    const item = await getMercadoLivreItem(itemMatch[1], accessToken);
    if (String(item.seller_id) !== String(notification.user_id)) {
      throw new Error("Mercado Livre item does not belong to the connected seller");
    }
    await saveMercadoLivreItems([item]);
    return { kind: "item", resourceId: item.id };
  }

  if (notification.topic === "orders_v2" && orderMatch) {
    const accessToken = await getMercadoLivreAccessToken();
    const order = await getMercadoLivreOrder(orderMatch[1], accessToken);
    if (String(order.seller?.id ?? "") !== String(notification.user_id)) {
      throw new Error("Mercado Livre order does not belong to the connected seller");
    }
    await saveMercadoLivreOrders([order]);
    return { kind: "order", resourceId: String(order.id) };
  }

  return { kind: "ignored" };
}
