# PRD — Barokah Jaya Fashion

## 1. Product Overview
Barokah Jaya Fashion is a women's fashion storefront, company profile, product catalog, online ordering, WhatsApp ordering, testimonial, and admin backoffice platform.

Primary goal: establish a polished online presence, showcase products, simplify ordering, and let admins manage products, inventory, orders, testimonials, and homepage content.

## 2. Business Goals
- Establish Barokah Jaya Fashion's online presence.
- Make products easy to discover.
- Support product variants and stock.
- Make ordering low-friction.
- Connect customers to WhatsApp.
- Give admins control over business content.
- Build an SEO-friendly foundation.

## 3. Target Users

### Customers
Women discovering the brand through Instagram, TikTok, Google, WhatsApp, or existing customers.

Typical journey:
Instagram/TikTok → Website → Collection → Product → Variant → Order → WhatsApp

### Admin
Manages products, categories, variants, stock, orders, testimonials, homepage content, promotions, and settings.

## 4. Technology Stack
- Next.js
- TypeScript
- App Router
- React Server Components
- Server Actions / Route Handlers
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- PostgreSQL
- Prisma ORM
- Auth.js
- Docker
- Nginx
- Local server file storage

Images are stored under `/public/uploads/`. No object storage.

## 5. MVP Scope

### Storefront
- Homepage
- Product catalog
- Categories
- Product detail
- Product variants
- Cart
- WhatsApp ordering
- Testimonials
- About
- Contact/store information
- Responsive design
- SEO metadata

### Backoffice
- Authentication
- Dashboard
- Products
- Categories
- Variants
- Inventory
- Orders
- Customers
- Testimonials
- Homepage CMS
- Store settings

## 6. Storefront

### Homepage
Sections:
1. Navbar
2. Hero
3. Featured Collection
4. New Arrivals
5. Brand Story
6. Best Sellers
7. Promotional Banner
8. Testimonials
9. Store Information
10. Social Media
11. Footer

### Navbar
Desktop:
Home, Collection, About, Testimonials, Contact, Search, Cart, Order Now.

Mobile:
Logo + menu.

Sticky on scroll, responsive, minimal, and clear.

### Hero
Soft feminine editorial hero.

Example:
"Beauty in Every Detail"

Editable:
- Heading
- Description
- Image
- CTA label
- CTA destination
- Visibility

### Product Catalog
URL: `/collection`

Filters:
- Category
- Price
- Size
- Color
- Availability

Sorting:
- Newest
- Popular
- Price low to high
- Price high to low

### Product Detail
URL: `/product/[slug]`

Show:
- Product gallery
- Name
- Price / discount
- Description
- Category
- Material
- Color
- Size
- Variant
- Stock
- Quantity
- Add to cart
- Order via WhatsApp
- Size guide
- Care instructions

Variant fields:
- Color
- Size
- SKU
- Stock
- Price

Unavailable combinations must be disabled.

## 7. WhatsApp Ordering
Primary ordering mechanism for MVP.

Customer selects product, variant, and quantity, then clicks "Order via WhatsApp".

Generated message should include:
- Product
- Variant
- Quantity
- Price
- Order summary

WhatsApp number must be configurable in admin settings.

## 8. Cart & Checkout
MVP cart:
- Add
- Remove
- Change quantity
- Change variant
- View subtotal

Guest checkout only.

Customer information:
- Name
- WhatsApp
- Address
- Optional notes

Create an order reference:
`BJF-YYYYMMDD-XXXX`

Server must validate current product price and stock before creating an order.

## 9. Order Status
- PENDING
- CONFIRMED
- PROCESSING
- PACKED
- SHIPPED
- COMPLETED
- CANCELLED

## 10. Testimonials
Fields:
- Customer name
- Profile image
- Rating
- Review
- Product
- Verified
- Published
- Display order

Only published testimonials appear publicly.

## 11. About
Editable:
- Brand story
- Description
- Values
- Optional founder story
- Store image

## 12. Store Information
- Store name
- Address
- Phone
- WhatsApp
- Opening hours
- Google Maps URL
- Social links

## 13. Backoffice

Route: `/admin`

Navigation:
- Dashboard
- Products
- Categories
- Inventory
- Orders
- Customers
- Testimonials
- Homepage
- Promotions
- Settings

### Dashboard
Show:
- Today's revenue
- Today's orders
- Pending orders
- Products sold
- Low-stock products
- Sales overview
- Best-selling products

### Product Management
Admin can:
- Create
- Edit
- Delete
- Publish/unpublish
- Duplicate

Fields:
- Name
- Slug
- Description
- Category
- Material
- Price
- Discount price
- Status
- Featured
- Best seller
- New arrival
- Images

### Inventory
Track stock at variant level.

Statuses:
- IN_STOCK
- LOW_STOCK
- OUT_OF_STOCK

Default low-stock threshold: 5.

### Order Management
Admin can:
- View order
- Update status
- Add notes
- View customer
- View items and variants
- View order history

### Customer Management
Store:
- Name
- WhatsApp
- Email
- Address
- Total orders
- Total spending
- Last order

Customer accounts are not required for MVP.

### Homepage CMS
Editable:
- Hero
- Featured products
- About
- Testimonials
- Promotional banner
- Store information

Do not build a generic drag-and-drop page builder.

## 14. Promotions
Fields:
- Name
- Code
- Type
- Value
- Minimum purchase
- Maximum discount
- Start date
- End date
- Usage limit
- Active

Types:
- Percentage
- Fixed amount

Can be implemented after core MVP ordering is stable.

## 15. Settings
- Brand name
- Logo
- Favicon
- WhatsApp
- Phone
- Email
- Address
- Opening hours
- Instagram
- TikTok
- Facebook
- Google Maps
- SEO title
- SEO description

## 16. Authentication
Roles:
- OWNER: full access
- ADMIN: products, inventory, orders, testimonials, homepage

Authorization must be enforced server-side.

## 17. Database Entities
Core:
- User
- Category
- Product
- ProductImage
- ProductVariant
- Customer
- Order
- OrderItem
- Testimonial
- HomepageSection
- Promotion
- PromotionUsage
- StoreSetting

## 18. Image Storage
Local:
`/public/uploads/`

Folders:
- products/
- testimonials/
- homepage/
- banners/
- settings/

Rules:
- Max 5 MB
- JPG/JPEG/PNG/WEBP
- Server-generated filenames
- MIME validation
- Extension validation
- Path traversal prevention
- Image optimization
- Persistent Docker volume

## 19. SEO
Public pages need:
- Title
- Meta description
- Canonical URL
- Open Graph
- Sitemap
- robots.txt
- Structured data

Product pages should use Product structured data.
Business information may use LocalBusiness structured data.

## 20. Performance
- Mobile-first
- Next/Image
- Optimized images
- Lazy loading
- Server Components by default
- Minimal client JavaScript
- Avoid unnecessary API calls
- Good Core Web Vitals

## 21. Accessibility
- Semantic HTML
- Keyboard navigation
- Form labels
- Focus states
- Alt text
- Accessible dialogs/dropdowns
- Color is not the only status indicator

## 22. Security
- Server-side authorization
- Input validation
- Secure sessions
- File upload validation
- Rate limiting where appropriate
- Secrets never exposed client-side
- Client price is never trusted
- Server recalculates totals

## 23. Non-Goals
MVP does not require:
- Native mobile app
- AI chatbot
- Recommendation engine
- Loyalty program
- Advanced CRM
- Warehouse management
- Multi-store
- Multi-vendor
- ERP integration
- Full shipping API
- Advanced marketing automation

## 24. Success Criteria
- Customers can browse products.
- Customers can select variants.
- Customers can add to cart.
- Customers can create orders.
- Customers can continue via WhatsApp.
- Admin can manage products, variants, inventory, orders, testimonials, and homepage content.
- Website works well on mobile.
- Public pages are SEO-ready.
- Uploads persist across deployments.

## 25. Future Roadmap
Phase 2:
- Payment gateway
- Automatic payment verification
- Shipping API
- Customer accounts
- Order tracking
- Promo codes
- Notifications

Phase 3:
- Sales analytics
- Customer segmentation
- Loyalty
- Recommendations
- Abandoned cart
- Marketing automation

Phase 4:
- AI shopping assistant
- Demand forecasting
- Automated product descriptions
- Personalized recommendations
