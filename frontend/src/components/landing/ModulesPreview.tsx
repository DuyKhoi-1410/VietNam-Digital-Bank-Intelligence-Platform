"use client";

import Link from "next/link";
import {
  TrendingUp,
  Building2,
  GitFork,
  Search,
  Download,
  ArrowRight,
} from "lucide-react";

const MODULES = [
  {
    id: "01",
    title: "Tổng Quan Thị Trường",
    route: "/dashboard",
    badge: "Phân Tích Vĩ Mô",
    icon: TrendingUp,
    accent: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
    description:
      "Khám phá điểm đánh giá toàn thị trường, phân bổ cảm xúc, xu hướng theo tháng và các khía cạnh dịch vụ ngân hàng.",
    features: [
      "Điểm sao trung bình & khối lượng đánh giá",
      "Phân bổ cảm xúc Tích cực, Trung tính, Tiêu cực",
      "Mức độ phổ biến của khía cạnh & Điểm cảm xúc ròng (NSS)",
      "Báo cáo các điểm nghẽn trải nghiệm toàn hệ thống",
    ],
  },
  {
    id: "02",
    title: "Thông Tin Ngân Hàng",
    route: "/dashboard/banks",
    badge: "Phân Tích Đơn Ứng Dụng",
    icon: Building2,
    accent: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400",
    description:
      "Thấu hiểu điểm mạnh, điểm yếu và phản hồi khách hàng gắn liền với từng ứng dụng ngân hàng số riêng biệt.",
    features: [
      "Tách biệt điểm sao với cảm xúc NLP",
      "Điểm cảm xúc ròng theo 7 khía cạnh dịch vụ",
      "Theo dõi độ chấp nhận theo từng phiên bản ứng dụng",
      "Xem trích dẫn nguyên văn kèm nhãn cảm xúc",
    ],
  },
  {
    id: "03",
    title: "Đối Sánh Cạnh Tranh",
    route: "/dashboard/benchmark",
    badge: "So Sánh Đa Ứng Dụng",
    icon: GitFork,
    accent: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
    description:
      "So sánh trực tiếp các ứng dụng ngân hàng số dựa trên điểm đánh giá, cảm xúc và các khía cạnh trải nghiệm.",
    features: [
      "Ma trận so sánh tùy chọn linh hoạt 2 đến 7 ngân hàng",
      "Khoảng cách hiệu năng giữa ứng dụng dẫn đầu và tụt hậu",
      "Bảng đối sánh điểm cảm xúc khía cạnh (NSS)",
      "Phân bổ chuẩn hóa 100% tỷ lệ sao từ 1 đến 5 sao",
    ],
  },
  {
    id: "04",
    title: "Tra Cứu Đánh Giá",
    route: "/dashboard/reviews",
    badge: "Bằng Chứng Đã Khử Trùng",
    icon: Search,
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    description:
      "Tìm kiếm và điều tra các đánh giá Google Play nguyên bản với đầy đủ ngữ cảnh phân tích và bóc tách câu.",
    features: [
      "Tập dữ liệu chuẩn 19.303 đánh giá duy nhất đã khử trùng",
      "Bộ lọc đa tiêu chí: Ngân hàng, Số sao, Cảm xúc, Khía cạnh",
      "Đảm bảo không nhân bản dòng khi lọc theo khía cạnh",
      "Bóc tách câu phụ chi tiết cho các đánh giá dài (≥ 4 từ)",
    ],
  },
  {
    id: "05",
    title: "Báo Cáo & Xuất Dữ Liệu",
    route: "/dashboard/reports",
    badge: "Quản Trị & Xuất Tệp",
    icon: Download,
    accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    description:
      "Truy cập và xuất các tập dữ liệu tổng hợp và bằng chứng đánh giá đã lọc dưới định dạng CSV hoặc JSON.",
    features: [
      "Tải trực tiếp bảng dữ liệu tổng hợp định dạng CSV & JSON",
      "Công cụ xuất đánh giá đã lọc có giới hạn an toàn",
      "Lưu vết truy vấn và tham số phục vụ kiểm toán",
      "Tự động đính kèm header số lượng dòng kết quả HTTP",
    ],
  },
];

export function ModulesPreview() {
  return (
    <section id="modules" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-900/80">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-violet-600/10 blur-[170px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Năng Lực Nền Tảng
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Năm Module Phân Tích <br />
            <span className="text-gradient-aurora">Chuyên Sâu & Thực Chiến.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Từ góc nhìn cảm xúc khách hàng ở quy mô vĩ mô đến từng câu phàn nàn vi mô,
            khám phá hệ thống công cụ sẵn sàng vận hành của Vietnam Digital Banking Intelligence.
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="glass-card rounded-2xl p-7 flex flex-col justify-between group hover:-translate-y-1 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.accent} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-slate-400 font-semibold">{m.id}</span>
                  </div>

                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60 mb-3">
                    {m.badge}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {m.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {m.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    href={m.route}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors"
                  >
                    <span>Truy cập Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
