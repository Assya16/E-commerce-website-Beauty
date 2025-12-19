# Design Guidelines: Feminine Beauty E-Commerce Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from leading beauty e-commerce platforms including Glossier (clean minimalism), Rare Beauty (soft approachability), and Sephora (comprehensive product display). The design emphasizes visual storytelling through product photography while maintaining an elegant, feminine aesthetic.

**Core Principles**:
- Soft, approachable elegance that feels premium yet accessible
- Product-first visual hierarchy with generous white space
- Feminine without being overly decorative - sophisticated restraint
- Trust-building through clean layouts and clear information

## Typography

**Font Families** (via Google Fonts):
- **Primary**: 'Cormorant Garamond' - Elegant serif for headings and hero text
- **Secondary**: 'Inter' - Clean sans-serif for body text, buttons, and UI elements

**Hierarchy**:
- Hero Headlines: 3xl to 5xl, Cormorant Garamond, font-light
- Section Headers: 2xl to 3xl, Cormorant Garamond, font-normal
- Product Titles: lg to xl, Inter, font-medium
- Body Text: base, Inter, font-normal
- Prices: lg to xl, Inter, font-semibold
- Buttons/CTAs: sm to base, Inter, font-medium, uppercase letter-spacing

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Grid gaps: gap-4 to gap-8
- Element margins: m-2 to m-6

**Grid Structures**:
- Product grids: 2 columns mobile, 3-4 columns desktop (grid-cols-2 lg:grid-cols-4)
- Max container width: max-w-7xl for main content
- Product cards: Maintain 3:4 aspect ratio for images

## Page Designs

### Homepage
**Hero Section** (80vh):
- Large lifestyle image featuring model using products in soft, natural lighting
- Centered overlay with welcome message: "Discover Your Natural Glow"
- Primary CTA button with backdrop blur effect
- Subtle scroll indicator

**Featured Collections** (multi-column):
- 3-column grid showcasing category cards (Skincare, Makeup, New Arrivals)
- Each with category image, title, and "Shop Now" link
- Hover: subtle scale transform

**Best Sellers Grid**:
- 4-column product grid with clean product cards
- Each card: product image (3:4 ratio), brand name, product name, price, "Add to Cart" button

**Trust Section**:
- 3-column feature highlights: "Cruelty-Free", "Natural Ingredients", "Free Shipping"
- Icon + short description format

### Product Catalog
- Filter sidebar (left): Categories, price range, skin type, concerns
- 3-4 column product grid with infinite scroll
- Each card: hover reveals quick-add-to-cart overlay
- Breadcrumb navigation at top
- Sort dropdown (Price, Newest, Popularity)

### Product Detail Page
**Two-column layout**:
- Left: Large product image with thumbnail gallery below (4-5 images)
- Right: Brand name, product name, rating stars, price, size selector, quantity, "Add to Bag" CTA, accordion sections (Description, Ingredients, How to Use, Reviews)

**Below the fold**:
- "You May Also Like" carousel (6-8 products)
- Customer reviews section

### Shopping Cart
**Full-width container with two sections**:
- Main area (70%): Cart items list with product image, name, size, quantity adjuster, remove button, subtotal
- Sidebar (30%): Order summary card with subtotal, shipping, total, promo code input, "Proceed to Checkout" button

### Checkout
**Progressive disclosure** (single column, max-w-2xl centered):
- Step indicators at top (Shipping → Payment → Review)
- Form sections with generous spacing
- Order summary sticky sidebar on desktop

### Admin Dashboard
**Clean data-focused design**:
- Top navbar with logout button
- Sidebar navigation (Products, Orders, Analytics)
- Products table view with inline edit/delete actions
- "Add Product" modal with image upload, form fields (name, brand, category, price, description, ingredients)
- Drag-and-drop image uploader

## Component Library

**Buttons**:
- Primary: Filled with rounded corners (rounded-full), medium padding (px-8 py-3)
- Secondary: Outline style, same padding
- Icon buttons: Square with icon centered

**Product Cards**:
- White background with subtle shadow on hover
- Image fills top portion, content below with padding
- "Add to Cart" appears on image hover with backdrop blur

**Form Inputs**:
- Rounded borders (rounded-lg), generous padding (p-3)
- Soft border styling
- Focus state with subtle shadow

**Navigation**:
- Top navbar: Logo left, main links center, cart/account icons right
- Sticky on scroll with backdrop blur
- Mobile: Hamburger menu with slide-out drawer

**Modals/Overlays**:
- Centered with soft shadow, rounded corners (rounded-2xl)
- Backdrop with blur effect
- Smooth fade-in animation

## Images

**Hero Image**: Lifestyle photography showing a person applying skincare/makeup in natural morning light. Soft focus background, warm tones. Image should convey self-care and natural beauty.

**Category Cards**: Close-up product photography on clean white or soft pink backgrounds

**Product Images**: Professional product photography with consistent lighting, white or minimal backgrounds, showing packaging clearly

**Feature Section**: Optional subtle texture or pattern background for trust/feature sections

## Icons
Use **Heroicons** via CDN for all interface icons (cart, user, search, filter, etc.)