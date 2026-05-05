import { FilterPanel } from '@/features/products/components/FilterPanel';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import {
  getAllProducts,
  getProducts,
  extractAvailableFilters,
} from '@/features/products/server/products';
import { parseProductFilters } from '@/features/products/server/schemas';

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);
  const availableFilters = extractAvailableFilters(await getAllProducts());
  const currentFilters = parseProductFilters(resolvedSearchParams);

  return (
    <div className="min-h-screen py-12 dark:bg-slate-950">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-sm tracking-[0.35em] text-cyan-400 uppercase">Products</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">Shop the latest drops</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Browse inventory with type-safe filters, synced URL state, and server-driven product
            data.
          </p>
        </header>

        <div className="grid gap-8 xl:grid-cols-[300px_1fr]">
          <FilterPanel availableFilters={availableFilters} currentFilters={currentFilters} />

          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm tracking-[0.25em] text-cyan-400 uppercase">Results</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  {products.length} items found
                </h2>
              </div>
            </div>

            <ProductGrid
              products={products}
              renderAction={(product) => (
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  priceSnapshot={product.price}
                  image={product.image}
                  stock={product.stock}
                />
              )}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
