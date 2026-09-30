export const runtime = 'edge';
import { auth } from "@/lib/auth";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#3D3436]">Dashboard</h1>
        <p className="text-sm text-[#75696C] mt-1">
          Selamat datang kembali, {session?.user?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pendapatan Hari Ini"
          value="Rp 0"
          icon={TrendingUp}
          color="text-[#7A9B82]"
          bg="bg-[#7A9B82]/10"
        />
        <StatCard
          label="Pesanan Hari Ini"
          value="0"
          icon={ShoppingCart}
          color="text-[#E8B7C6]"
          bg="bg-[#FBECEF]"
        />
        <StatCard
          label="Pesanan Pending"
          value="0"
          icon={AlertTriangle}
          color="text-[#C79B55]"
          bg="bg-[#C79B55]/10"
        />
        <StatCard
          label="Total Produk"
          value="0"
          icon={Package}
          color="text-[#75696C]"
          bg="bg-[#FFF7F3]"
        />
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#EDE2E5] p-6">
          <h2 className="font-semibold text-[#3D3436] mb-4">Pesanan Terbaru</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ShoppingCart className="w-10 h-10 text-[#EDE2E5] mb-2" />
            <p className="text-sm text-[#A99B9F]">Belum ada pesanan</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EDE2E5] p-6">
          <h2 className="font-semibold text-[#3D3436] mb-4">Stok Menipis</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package className="w-10 h-10 text-[#EDE2E5] mb-2" />
            <p className="text-sm text-[#A99B9F]">Semua stok aman</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE2E5] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#75696C]">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-[#3D3436]">{value}</p>
    </div>
  );
}
