# AGENT.md — Barokah Jaya Fashion

## 1. Project Context
Barokah Jaya Fashion is an Indonesian women's fashion business.

The application combines:
- Company profile
- Fashion storefront
- Product catalog
- Product variants
- Online ordering
- WhatsApp ordering
- Testimonials
- Admin backoffice

Visual identity:
**Soft Pink Boutique**

The final result should feel like a real fashion brand, not an AI-generated demo.

## 2. Stack
Use:
- Next.js
- TypeScript
- App Router
- React Server Components
- Server Actions
- Route Handlers
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- PostgreSQL
- Prisma
- Auth.js
- Docker
- Nginx

File storage:
`/public/uploads/`

Do not use:
- S3
- Cloudinary
- Firebase Storage
- Object storage

## 3. Architecture
Use a Next.js monolith:

Browser
→ Next.js
→ Storefront / Admin / Server Actions / Route Handlers
→ Prisma
→ PostgreSQL

Do not introduce a separate Express/Fastify API unless there is a documented technical reason.

## 4. Development Philosophy
Priorities:
1. Simplicity
2. Maintainability
3. Performance
4. Security
5. UX
6. SEO

Avoid over-engineering.

If Next.js can solve a problem cleanly, prefer native Next.js functionality.

## 5. Component Rules
Create reusable components for repeated UI:
- ProductCard
- ProductGrid
- ProductGallery
- VariantSelector
- PriceDisplay
- WhatsAppButton
- TestimonialCard
- SectionHeading
- Navbar
- Footer

Do not create components for every tiny HTML wrapper.

Reuse before creating new components.

## 6. Server vs Client Components
Default to Server Components.

Use Client Components only where interaction/browser APIs require them:
- Cart
- Variant selector
- Search interaction
- Mobile menu
- Image gallery
- Interactive admin tables
- Modal
- Toast
- Interactive forms

Do not put `"use client"` on entire page trees without a reason.

## 7. Data Access
Use Prisma for database access.

Never access PostgreSQL from client components.

Preferred:
Server Component → Service/Prisma → Database

or:
Client Component → Server Action → Prisma → Database

## 8. Database
Core models:
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

Add indexes for:
- slug
- SKU
- order reference
- customer WhatsApp
- order status
- createdAt

Do not store images as binary blobs in PostgreSQL.

## 9. Product Rules
Products can have multiple images and variants.

A variant is a sellable combination:
Color + Size + SKU + Stock + Price.

Stock belongs to the variant, not the product.

## 10. Pricing
Never trust price values from the browser.

When creating an order:
1. Receive product/variant IDs.
2. Fetch current database prices.
3. Validate availability.
4. Calculate subtotal server-side.
5. Apply discounts server-side.
6. Store final totals.

The client never determines the final payable amount.

## 11. Cart
MVP cart may be client-side/session-based.

Cart is never the source of truth.

Cart → Server validation → Current DB price → Stock validation → Order creation.

## 12. WhatsApp
WhatsApp number must come from Store Settings.

Do not hardcode the business number in components.

Generated messages should include:
- Order reference
- Product
- Variant
- Quantity
- Price
- Order summary

## 13. Image Upload
Store images under:
`/public/uploads/`

Folders:
- products/
- testimonials/
- homepage/
- banners/
- settings/

Requirements:
- Max 5 MB
- JPG/JPEG/PNG/WEBP only
- Server-generated filenames
- MIME validation
- Extension validation
- Path traversal prevention
- No executable files
- Optimize images where possible
- Persistent Docker volume

Example:
Host `./data/uploads` → Container `/app/public/uploads`

## 14. Authentication
Public storefront does not require login.

Admin pages require authentication.

Authorization must be enforced server-side.

Never rely only on client-side role checks.

## 15. Roles
OWNER:
- Full access

ADMIN:
- Products
- Inventory
- Orders
- Testimonials
- Homepage

## 16. Storefront Rules
Prioritize:
- Product photography
- Clear pricing
- Easy browsing
- Mobile UX
- WhatsApp CTA
- Brand identity

Do not overload the homepage.

## 17. Design Rules
Follow `design.md`.

Core visual language:
- Soft Pink
- Cream
- Warm White
- Dark Brown
- Elegant Serif
- Clean Sans Serif

Use pink as an accent, not on everything.

## 18. Anti-Patterns
Do not create:
- Generic SaaS landing pages
- Purple/blue gradients
- Excessive glassmorphism
- Huge meaningless headings
- Random decorative blobs
- Excessive cards
- Fake statistics
- Fake testimonials
- Fake reviews
- Generic irrelevant stock imagery
- Excessive animation

## 19. Content
Never invent real business information.

Do not fabricate:
- Customer count
- Years in business
- Reviews
- Address
- Phone number
- Social followers
- Awards
- Certifications
- Business claims

Use configurable placeholders or TODO for unknown data.

## 20. SEO
Public pages need:
- Metadata
- Canonical URLs
- Open Graph
- Sitemap
- robots.txt
- Structured data where appropriate

Product pages should use Product structured data.

Use semantic HTML and correct heading hierarchy.

## 21. Accessibility
Require:
- Keyboard support
- Focus states
- Form labels
- Proper button semantics
- Alt text
- Accessible dialogs/dropdowns
- Color is not the only status indicator

## 22. Responsive
Test:
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px

Mobile is an intentionally designed layout, not merely a smaller desktop.

Recommended product grid:
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 4 columns

## 23. Performance
Prefer:
- Server Components
- Next/Image
- Optimized images
- Lazy loading
- Static rendering where appropriate
- Minimal client JS

Avoid:
- Huge JS bundles
- Unnecessary dependencies
- Client fetching for static content
- Loading all products at once
- Huge unoptimized images

## 24. Error Handling
Important actions need:
- Loading
- Success
- Error
- Empty states

Do not expose raw database errors to users.

Use friendly messages in UI and log technical details server-side.

## 25. Forms
Every form needs:
- Validation
- Required field indicators
- Error messages
- Loading state
- Success feedback

Use consistent schema validation.

## 26. Order Creation
Use a transaction:

BEGIN
→ Validate customer
→ Fetch variants
→ Validate stock
→ Calculate price
→ Create order
→ Create order items
→ Update stock
→ COMMIT

On failure:
ROLLBACK

Do not create partially completed orders.

## 27. Inventory
Stock changes happen server-side only.

Never allow client-side direct stock mutation.

## 28. Admin UX
Optimize for speed.

Common workflow:
Open order → see customer → see items → see total → update status.

Avoid unnecessary modal chains.

## 29. Homepage CMS
Homepage content must be editable without code changes.

Editable:
- Hero
- Featured products
- About
- Testimonials
- Promotional banner
- Store information

Do not build a generic drag-and-drop page builder.

## 30. Recommended Structure

app/
├── (storefront)/
│   ├── page.tsx
│   ├── collection/
│   ├── product/
│   ├── about/
│   ├── testimonials/
│   └── contact/
├── admin/
│   ├── page.tsx
│   ├── products/
│   ├── categories/
│   ├── inventory/
│   ├── orders/
│   ├── customers/
│   ├── testimonials/
│   ├── homepage/
│   └── settings/
├── api/
│   └── upload/
└── layout.tsx

components/
├── ui/
├── storefront/
└── admin/

lib/
├── db.ts
├── auth.ts
├── validations/
├── services/
└── utils/

prisma/
└── schema.prisma

public/
└── uploads/

types/

Adapt when necessary, but do not prematurely abstract.

## 31. Dependency Rules
Before adding a package:
1. Can Next.js solve it?
2. Can React solve it?
3. Can a small utility solve it?
4. Is the package actually needed?

Avoid dependency bloat.

## 32. Implementation Order
1. Project setup
2. Database schema
3. Authentication
4. Admin layout
5. Product/category CRUD
6. Product storefront
7. Variants/inventory
8. Homepage
9. WhatsApp ordering
10. Testimonials
11. Homepage CMS
12. SEO
13. Responsive refinement
14. Security review
15. Performance review

## 33. Before Coding
1. Read PRD.md.
2. Read design.md.
3. Inspect existing implementation.
4. Inspect database schema.
5. Reuse existing components.
6. Avoid duplicate functionality.

Do not blindly create new files.

## 34. Before Finishing a Feature
Check:
- Desktop
- Mobile
- Loading state
- Empty state
- Error state
- Validation
- Authorization
- SEO if public
- Accessibility
- Database consistency
- Console errors

## 35. Definition of Done
A feature is complete only when:
- UI works
- Data works
- Validation works
- Error handling works
- Mobile works
- Authorization works
- Loading state exists
- Empty state exists
- No obvious console errors
- No fake production content remains

## 36. AI Agent Behavior
When working:
- Inspect before modifying.
- Reuse before creating.
- Keep implementation simple.
- Do not over-engineer.
- Do not introduce unnecessary dependencies.
- Do not change unrelated code.
- Do not rewrite working components without reason.
- Do not fabricate business information.
- Follow PRD.md.
- Follow design.md.
- Keep storefront visually intentional.
- Keep admin practical.

If requirements are ambiguous, choose the simplest implementation consistent with the PRD.

## 37. Final Quality Standard
The final application should feel like:

"A real Indonesian women's fashion boutique with a polished digital storefront and a practical internal management system."

It must not feel like:
"An AI-generated demo, generic template, SaaS dashboard, or over-engineered enterprise system."
