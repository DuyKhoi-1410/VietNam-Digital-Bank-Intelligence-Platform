"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Dữ liệu được thu thập và làm sạch như thế nào?",
    answer:
      "Tập dữ liệu gồm 19,303 đánh giá duy nhất từ người dùng thật trên Google Play Store qua 7 ứng dụng ngân hàng số hàng đầu Việt Nam. Toàn bộ dữ liệu được áp dụng thuật toán khử trùng lặp nghiêm ngặt: ROW_NUMBER() OVER (PARTITION BY ID ORDER BY Word_Count ASC, Time DESC) để loại bỏ hoàn toàn các bản ghi bị nhân bản.",
  },
  {
    question: "Mô hình ABSA bóc tách 7 khía cạnh trải nghiệm hoạt động ra sao?",
    answer:
      "Mô hình Aspect-Based Sentiment Analysis (ABSA) phân tích chuyên sâu từng câu trong bài đánh giá và gán nhãn vào 7 khía cạnh nghiệp vụ: Đăng nhập & Xác thực, Giao dịch chuyển tiền, UI/UX, Hiệu năng ứng dụng, Phí & Chính sách, Hỗ trợ khách hàng, và Ưu đãi & Tiện ích. Điều này giúp phát hiện chính xác tính năng nào làm hài lòng hoặc gây ức chế cho người dùng.",
  },
  {
    question: "Điểm sao Google Play khác gì với Chỉ số Cảm xúc NLP?",
    answer:
      "Điểm sao Google Play (1 đến 5 sao) là đánh giá cảm tính chung của người dùng, thường bị kéo tụt vì một sự cố đơn lẻ. Ngược lại, Chỉ số Cảm xúc NLP (Net Sentiment Score - NSS) được bóc tách trực tiếp từ ngữ nghĩa văn bản của từng tính năng cụ thể, giúp ban quản trị nhìn thấy sự thật đằng sau mỗi lượt chấm sao.",
  },
  {
    question: "Dữ liệu trên nền tảng có được đảm bảo tính thực tế và khách quan không?",
    answer:
      "Chính xác. Nền tảng kết nối trực tiếp đến kho dữ liệu phân tích đã được xác thực và chuẩn hóa thời gian thực. Chúng tôi tuân thủ nguyên tắc Zero-Mock-Data: 100% số liệu hiển thị trên toàn bộ các biểu đồ và bảng tra cứu đều bắt nguồn từ 19.303 phản hồi người dùng thực tế đã được kiểm toán độc lập.",
  },
  {
    question: "Nền tảng hỗ trợ đối sánh giữa các ngân hàng như thế nào?",
    answer:
      "Tại module Đối sánh cạnh tranh (M3), bạn có thể chọn từ 2 đến 4 ngân hàng bất kỳ để đặt lên bàn cân so sánh trực quan về điểm sao, cán cân cảm xúc, và ma trận hiệu năng của 7 khía cạnh trải nghiệm số.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Signature Stitch Section Header: Simple "Questions?" */}
        <div className="mb-14 text-left">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Questions?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            Những thắc mắc phổ biến về phương pháp luận và nền tảng trí tuệ ngân hàng số.
          </p>
        </div>

        {/* Minimalist Accordion List */}
        <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left group gap-4"
                >
                  <span className="text-lg sm:text-xl font-medium text-white group-hover:text-cyan-300 transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-slate-700/80 flex items-center justify-center text-slate-400 group-hover:text-white transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-slate-800" : "bg-slate-900/60"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-12 text-sm sm:text-base text-slate-300 leading-relaxed font-normal animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
