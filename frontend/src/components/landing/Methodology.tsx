"use client";

import { ShieldCheck, Info, FileSpreadsheet, Binary, BrainCircuit, BarChart2 } from "lucide-react";

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Đánh Giá Google Play",
    icon: FileSpreadsheet,
    desc: "Thu thập đánh giá người dùng thực tế từ 7 ứng dụng ngân hàng số thương mại hàng đầu Việt Nam.",
  },
  {
    step: "02",
    title: "Tiền Xử Lý Dữ Liệu",
    icon: Binary,
    desc: "Làm sạch ký tự, chuẩn hóa, khử trùng lặp xác định (19.303 bản ghi duy nhất) và phân tách ngắn/dài.",
  },
  {
    step: "03",
    title: "Phân Tích Cảm Xúc NLP",
    icon: BrainCircuit,
    desc: "Mô hình NLP tiếng Việt phân loại cảm xúc 3 nhóm: Tích cực, Trung tính, Tiêu cực kèm xác suất.",
  },
  {
    step: "04",
    title: "Phân Tích Khía Cạnh (ABSA)",
    icon: BrainCircuit,
    desc: "Bóc tách 13.864 câu phụ từ các đánh giá dài (≥ 4 từ) gán vào 7 khía cạnh trải nghiệm ngân hàng cốt lõi.",
  },
  {
    step: "05",
    title: "Trí Tuệ Ngân Hàng Số",
    icon: BarChart2,
    desc: "Tổng hợp chỉ số, Điểm cảm xúc ròng (NSS), xếp hạng rào cản ma sát và đối sánh cạnh tranh.",
  },
];

export function Methodology() {
  return (
    <section id="methodology" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[350px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Phương Pháp Luận Khoa Học
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Quy Trình Xử Lý Dữ Liệu <br />
            <span className="text-gradient-cyan">Minh Bạch & Chuẩn Mực.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Mọi phát hiện trên Vietnam Digital Banking Intelligence đều xuất phát từ quy trình kỹ thuật dữ liệu
            và mô hình phân tích xử lý ngôn ngữ tự nhiên đã qua thẩm định chặt chẽ.
          </p>
        </div>

        {/* 5-Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
          {PIPELINE_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="glass-card rounded-xl p-5 flex flex-col justify-between border border-slate-800/80 relative group hover:border-cyan-500/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-cyan-400">Bước {s.step}</span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Methodological Transparency Disclosures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disclosure 1: Population Boundary */}
          <div className="glass-panel rounded-2xl p-7 border-l-4 border-l-amber-500/80">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  Công Bố Giới Hạn Phạm Vi Mẫu Dữ Liệu
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Đánh giá người dùng trên Google Play phản ánh ý kiến của nhóm người dùng điện thoại Android chủ động để lại nhận xét trên kho ứng dụng, không đại diện cho toàn bộ tệp khách hàng của tất cả các ngân hàng. Các phân tích mô tả tập dữ liệu thực nghiệm đã thu thập.
                </p>
              </div>
            </div>
          </div>

          {/* Disclosure 2: Separation of Star Ratings vs. NLP Sentiment */}
          <div className="glass-panel rounded-2xl p-7 border-l-4 border-l-cyan-500/80">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  Tách Biệt Điểm Sao Và Cảm Xúc NLP
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Điểm chấm sao (thang đo định lượng từ 1 đến 5 sao) và nhãn cảm xúc từ mô hình NLP (Tích cực, Trung tính, Tiêu cực kèm điểm xác suất) đại diện cho hai chiều đo lường độc lập. Một đánh giá nhiều sao có thể chứa nội dung phàn nàn và ngược lại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
