import React, { useState, useEffect } from 'react';
import { BazaarCartProvider, useBazaarCart } from '../../features/bazaar/context/BazaarCartContext';
import BazaarQuickHeader from '../../features/bazaar/components/BazaarQuickHeader';
import BazaarCategoryCarousel from '../../features/bazaar/components/BazaarCategoryCarousel';
import BazaarHeroBanner from '../../features/bazaar/components/BazaarHeroBanner';
import BazaarPromoBanners from '../../features/bazaar/components/BazaarPromoBanners';
import BazaarDailyPassBuilder from '../../features/bazaar/components/BazaarDailyPassBuilder';
import BazaarProductShelf from '../../features/bazaar/components/BazaarProductShelf';
import BazaarStickyCartBar from '../../features/bazaar/components/BazaarStickyCartBar';
import BazaarCartDrawer from '../../features/bazaar/components/BazaarCartDrawer';
import BazaarSocietyFlatModal from '../../features/bazaar/components/BazaarSocietyFlatModal';
import { BAZAAR_PRODUCTS, BAZAAR_CATEGORIES } from '../../features/bazaar/data/quickCommerceData';
import '../../features/bazaar/styles/bazaar_quickcommerce.css';

function BazaarMarketplaceContent() {
  const { searchQuery, activeCategory } = useBazaarCart();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'GateLink Bazaar — Morning Doorstep Essentials (Milk, Eggs, Honey, Achar & Papad)';
    window.scrollTo(0, 0);
  }, []);

  // Filter products by search or active category
  const filteredProducts = BAZAAR_PRODUCTS.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.source && item.source.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== 'all') {
      return item.category === activeCategory;
    }
    return true;
  });

  // Grouped subsets when browsing 'all'
  const milkProducts = BAZAAR_PRODUCTS.filter(p => p.category === 'milk-dairy');
  const eggProducts = BAZAAR_PRODUCTS.filter(p => p.category === 'eggs');
  const vegProducts = BAZAAR_PRODUCTS.filter(p => p.category === 'vegetables');
  const acharProducts = BAZAAR_PRODUCTS.filter(p => p.category === 'achar');
  const papadProducts = BAZAAR_PRODUCTS.filter(p => p.category === 'papad');
  const honeyProducts = BAZAAR_PRODUCTS.filter(p => p.category === 'honey-ghee');

  return (
    <div className="bazaar-qc-container">
      {/* Quick Commerce Header */}
      <BazaarQuickHeader onOpenLocationModal={() => setIsLocationModalOpen(true)} />

      {/* Category Icons Carousel */}
      <BazaarCategoryCarousel />

      {/* Main Shelves & Promos */}
      <main className="qc-main-content">
        {!searchQuery && activeCategory === 'all' && (
          <>
            {/* Hero Essentials Banner (Screenshot Match) */}
            <BazaarHeroBanner />
            <BazaarPromoBanners />
          </>
        )}

        {/* If search query or specific category is selected */}
        {(searchQuery.trim() || activeCategory !== 'all') ? (
          activeCategory === 'daily-pass' && !searchQuery.trim() ? (
            <BazaarDailyPassBuilder />
          ) : (
            <BazaarProductShelf
              title={
                searchQuery.trim() 
                  ? `Search Results for "${searchQuery}"` 
                  : (BAZAAR_CATEGORIES.find(c => c.id === activeCategory)?.name || 'Products')
              }
              icon={BAZAAR_CATEGORIES.find(c => c.id === activeCategory)?.icon || '🔍'}
              count={filteredProducts.length}
              products={filteredProducts}
            />
          )
        ) : (
          /* Default Quick Commerce Bento Shelves */
          <>
            <BazaarProductShelf
              title="Daily Fresh Milk & Dairy"
              icon="🥛"
              count={milkProducts.length}
              products={milkProducts}
            />

            <BazaarProductShelf
              title="Farm Fresh Country & Brown Eggs"
              icon="🥚"
              count={eggProducts.length}
              products={eggProducts}
            />

            <BazaarProductShelf
              title="Farm Direct Fresh Vegetables"
              icon="🥦"
              count={vegProducts.length}
              products={vegProducts}
            />

            <BazaarProductShelf
              title="Dadi's Homemade Achars & Pickles"
              icon="🌶️"
              count={acharProducts.length}
              products={acharProducts}
            />

            <BazaarProductShelf
              title="Handcrafted Sun-Dried Papads & Crisps"
              icon="🍘"
              count={papadProducts.length}
              products={papadProducts}
            />

            {/* Custom Daily Society Pass Builder (Placed after Papad section) */}
            <BazaarDailyPassBuilder />

            <BazaarProductShelf
              title="100% Pure Raw Honey, Ghee & Cold-Pressed Oils"
              icon="🍯"
              count={honeyProducts.length}
              products={honeyProducts}
            />
          </>
        )}
      </main>

      {/* Floating Sticky Cart Bar (Blinkit / Zepto style) */}
      <BazaarStickyCartBar />

      {/* Slide-over Checkout Drawer */}
      <BazaarCartDrawer />

      {/* Society / Flat Switcher Modal */}
      <BazaarSocietyFlatModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
    </div>
  );
}

export default function BazaarLandingPage() {
  return (
    <BazaarCartProvider>
      <BazaarMarketplaceContent />
    </BazaarCartProvider>
  );
}
