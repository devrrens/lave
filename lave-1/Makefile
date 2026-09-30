.PHONY: dev build start lint \
        db-migrate db-migrate-reset db-seed db-studio db-generate db-push \
        docker-build docker-up docker-down docker-logs \
        setup clean

# ── Dev ──────────────────────────────────────────────────────────────────────
dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

lint:
	pnpm lint

typecheck:
	pnpm tsc --noEmit

# ── Database ─────────────────────────────────────────────────────────────────
db-generate:
	pnpm prisma generate

db-push:
	pnpm prisma db push

db-migrate:
	pnpm prisma migrate dev

db-migrate-reset:
	pnpm prisma migrate reset

db-seed:
	pnpm db:seed

db-studio:
	pnpm prisma studio

# ── Docker ───────────────────────────────────────────────────────────────────
docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f app

# ── Setup (first time) ───────────────────────────────────────────────────────
setup:
	cp -n .env.example .env || true
	pnpm install
	pnpm prisma generate
	pnpm prisma migrate dev --name init
	pnpm db:seed
	@echo ""
	@echo "✓ Setup selesai."
	@echo "  Jalankan: make dev"
	@echo "  Admin:    http://localhost:3000/admin/login"
	@echo "  Email:    owner@barokahjaya.com"
	@echo "  Password: admin123"

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	rm -rf .next node_modules
