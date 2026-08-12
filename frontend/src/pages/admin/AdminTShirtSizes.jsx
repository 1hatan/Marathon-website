import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchDashboardStats } from '../../services/api';
import { Shirt, PackageCheck } from 'lucide-react';

export default function AdminTShirtSizes() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchDashboardStats();
        if (res.success) setStats(res);
      } catch (err) {
        console.error('Failed to fetch t-shirt stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const sizeList = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Calculate totals per size
  const sizeTotals = sizeList.map((size) => {
    const item = (stats?.tshirtStats || []).find((s) => s.size === size);
    return { size, count: item ? item.count : 0 };
  });

  const grandTotal = sizeTotals.reduce((sum, item) => sum + item.count, 0);

  return (
    <AdminLayout title="T-Shirt Inventory & Size Dashboard">
      <div className="space-y-8">
        
        {/* Total Metric Card */}
        <div className="bg-black text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-xl border-2 border-gray-900 relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <span className="text-xs text-rock-yellow font-black uppercase tracking-widest block font-outfit">Total Running Apparel Orders</span>
            <h2 className="text-4xl sm:text-5xl font-black font-outfit uppercase tracking-tight text-white">{grandTotal} T-Shirts</h2>
            <p className="text-xs text-gray-300 font-medium">Aggregated count required for organizer vendor procurement.</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-rock-yellow text-black flex items-center justify-center shrink-0 shadow-md relative z-10">
            <Shirt className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>

        {/* Size Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sizeTotals.map((item) => (
            <div key={item.size} className="bg-white rounded-3xl p-5 border-2 border-gray-100 hover:border-black text-center shadow-sm transition-all group">
              <span className="text-[10px] font-black text-gray-500 block uppercase font-outfit">Size</span>
              <h3 className="text-3xl font-black text-black font-outfit my-1">{item.size}</h3>
              <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase font-outfit">
                {item.count} Required
              </div>
            </div>
          ))}
        </div>

        {/* Matrix Table by Race Category */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 space-y-4">
          <h3 className="text-base font-black text-black uppercase font-outfit tracking-tight border-l-4 border-rock-yellow pl-3">Category-Wise Breakdown Matrix</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-xs font-black text-black uppercase tracking-wider bg-gray-50 font-outfit">
                  <th className="py-3.5 px-4">Race Category</th>
                  {sizeList.map((s) => (
                    <th key={s} className="py-3.5 px-4 text-center">{s}</th>
                  ))}
                  <th className="py-3.5 px-4 text-right">Category Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {(stats?.categoryStats || []).map((cat) => {
                  let rowTotal = 0;
                  return (
                    <tr key={cat.category} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-extrabold text-black font-outfit">{cat.category}</td>
                      {sizeList.map((s) => {
                        const matrixItem = (stats?.tshirtMatrix || []).find(
                          (m) => m.race_name === cat.category && m.t_shirt_size === s
                        );
                        const cnt = matrixItem ? matrixItem.count : 0;
                        rowTotal += cnt;
                        return (
                          <td key={s} className="py-3.5 px-4 text-center font-bold text-gray-800">
                            {cnt}
                          </td>
                        );
                      })}
                      <td className="py-3.5 px-4 text-right font-black font-outfit text-black">{rowTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

