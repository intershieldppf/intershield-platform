import { NextRequest, NextResponse } from "next/server";
import { CatalogEngine } from "@/catalog";

export const runtime = "nodejs";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const rawQuery = request.nextUrl.searchParams.get("q") ?? "";
    const query = normalizeText(rawQuery);

    const result = await CatalogEngine.loadFromProjectMatrix();

    const tokens = query.split(/\s+/).filter(Boolean);

    const yearToken = tokens.find((token) => {
      const year = Number(token);
      return Number.isInteger(year) && year >= 1900 && year <= 2100;
    });

    const requestedYear = yearToken ? Number(yearToken) : null;

    const textTokens = tokens.filter((token) => token !== yearToken);

    const matchingVehicles = result.catalog.vehicles
      .filter((vehicle) => vehicle.universal !== true)
      .filter((vehicle) => {
        if (!query) return true;

        const searchableText = normalizeText(
          [
            vehicle.brand ?? "",
            vehicle.model ?? "",
            vehicle.slug ?? "",
          ].join(" ")
        );

        const textMatches = textTokens.every((token) =>
          searchableText.includes(token)
        );

        if (!textMatches) return false;

        if (requestedYear !== null) {
          const start = vehicle.yearStart;
          const end = vehicle.yearEnd ?? vehicle.yearStart;

          if (start !== null && requestedYear < start) return false;
          if (end !== null && requestedYear > end) return false;
        }

        return true;
      });

    const grouped = new Map<string, any>();

    for (const vehicle of matchingVehicles) {
      const key =
        requestedYear !== null
          ? `${normalizeText(vehicle.brand ?? "")}|${normalizeText(
              vehicle.model ?? ""
            )}`
          : `${normalizeText(vehicle.brand ?? "")}|${normalizeText(
              vehicle.model ?? ""
            )}|${vehicle.yearStart ?? ""}|${vehicle.yearEnd ?? ""}`;

      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          vehicleId: vehicle.vehicleId,
          vehicleIds: [vehicle.vehicleId],
          brand: vehicle.brand,
          model: vehicle.model,
          yearStart: vehicle.yearStart,
          yearEnd: vehicle.yearEnd,
          slug: vehicle.slug,
          imageUrl: vehicle.imageUrl,
          imageStatus: vehicle.imageStatus,
          imageAlt: vehicle.imageAlt,
        });

        continue;
      }

      if (!existing.vehicleIds.includes(vehicle.vehicleId)) {
        existing.vehicleIds.push(vehicle.vehicleId);
      }

      if (
        vehicle.yearStart !== null &&
        (existing.yearStart === null ||
          vehicle.yearStart < existing.yearStart)
      ) {
        existing.yearStart = vehicle.yearStart;
      }

      if (
        vehicle.yearEnd !== null &&
        (existing.yearEnd === null ||
          vehicle.yearEnd > existing.yearEnd)
      ) {
        existing.yearEnd = vehicle.yearEnd;
      }

      if (!existing.imageUrl && vehicle.imageUrl) {
        existing.imageUrl = vehicle.imageUrl;
        existing.imageStatus = vehicle.imageStatus;
        existing.imageAlt = vehicle.imageAlt;
      }
    }

    const vehicles = Array.from(grouped.values()).slice(0, 20);

    return NextResponse.json({
      query: rawQuery,
      requestedYear,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar os veículos." },
      { status: 500 }
    );
  }
}
