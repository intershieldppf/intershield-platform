import { LocalCatalogService } from "@/services/catalog/localCatalogService";

const service = new LocalCatalogService();

async function assertSearch(query: string) {
  const results = await service.searchVehicles(query);
  console.assert(results.length > 0, `Expected results for query: ${query}`);
  console.log(`Search '${query}' returned ${results.length} result(s)`);
}

async function assertListProductsForBMWX3() {
  const vehicles = await service.searchVehicles("BMW X3");
  const vehicle = vehicles[0]?.vehicle;
  console.assert(vehicle, "Expected at least one BMW X3 vehicle");

  if (vehicle) {
    const products = await service.listProductsByVehicleId(vehicle.id);
    console.assert(products.length > 0, "Expected compatible products for BMW X3");
    console.log(`BMW X3 compatible products: ${products.length}`);
  }
}

async function runExamples() {
  await assertSearch("Corolla");
  await assertSearch("Corola");
  await assertSearch("BMW X3");
  await assertSearch("BYD Dolphin Mini");
  await assertListProductsForBMWX3();
}

runExamples().catch((error) => {
  console.error(error);
  process.exit(1);
});
