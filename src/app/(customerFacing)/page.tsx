import { ArrowRight } from "lucide-react";
import db from "../../db/db";
import { Product } from "@prisma/client";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { ProductCard } from "../../components/ProductCard";
import { ProductCardSkeleton } from "../../components/ProductCard";
import { Suspense } from "react";
import { cache } from "../../lib/cache";

const getMostPopularProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailable: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  })
},
["/", "getMostPopularProducts"],
{ revalidate: 60 * 60 * 24 });

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
    take: 6,
})
},
["/", "getNewestProducts"]);

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title={"Most Popular Products"}
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection
        title={"Newest Products"}
        productsFetcher={getNewestProducts}
      />
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text 3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}