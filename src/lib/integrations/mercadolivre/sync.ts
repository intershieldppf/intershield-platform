import "server-only";

import {
  getMercadoLivreAccount,
  getMercadoLivreItems,
  listMercadoLivreItemIds,
  listMercadoLivreOrders,
} from "./client";
import { getMercadoLivreAccessToken } from "./store";
import {
  completeMercadoLivreSyncRun,
  failMercadoLivreSyncRun,
  saveMercadoLivreAccount,
  saveMercadoLivreItems,
  saveMercadoLivreOrders,
  setMercadoLivreSyncStage,
  startMercadoLivreSyncRun,
  updateMercadoLivreConnectionSyncMetadata,
} from "./syncStore";

export async function synchronizeMercadoLivre() {
  const run = await startMercadoLivreSyncRun();
  let stage = "account";
  try {
    const accessToken = await getMercadoLivreAccessToken();
    const account = await getMercadoLivreAccount(accessToken);
    await saveMercadoLivreAccount(account);
    await setMercadoLivreSyncStage(run.id, "items", { accounts_synced: 1 });

    stage = "items";
    const itemIds = await listMercadoLivreItemIds(String(account.id), accessToken);
    const items = await getMercadoLivreItems(itemIds, accessToken);
    await saveMercadoLivreItems(items);
    await setMercadoLivreSyncStage(run.id, "orders", { items_synced: items.length });

    stage = "orders";
    const orders = await listMercadoLivreOrders(String(account.id), accessToken);
    await saveMercadoLivreOrders(orders);
    await updateMercadoLivreConnectionSyncMetadata(items.length, orders.length);
    await completeMercadoLivreSyncRun(run.id, { accounts_synced: 1, items_synced: items.length, orders_synced: orders.length });

    return { accountId: String(account.id), nickname: account.nickname ?? null, items: items.length, orders: orders.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha desconhecida na sincronização.";
    await failMercadoLivreSyncRun(run.id, stage, message).catch(() => undefined);
    throw error;
  }
}

