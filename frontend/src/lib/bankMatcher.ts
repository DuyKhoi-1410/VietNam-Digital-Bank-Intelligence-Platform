/**
 * Bank & Aspect Matching Engine for Vietnam Digital Banking Intelligence
 * 
 * Handles all spelling variations, abbreviations, common misspellings,
 * informal naming conventions, synonyms, slang, stock tickers, and diacritic-free queries
 * for the 7 commercial banks and 7 genuine ABSA aspects in the dataset.
 */

export const CANONICAL_BANKS = [
  "BIDV SmartBanking",
  "MB Bank",
  "VCB Digibank",
  "VietinBank iPay",
  "TPBank Mobile",
  "TNEX",
  "Liobank",
] as const;

export type CanonicalBank = (typeof CANONICAL_BANKS)[number];

export const CANONICAL_ASPECTS = [
  "Bảo mật & Đăng nhập",
  "CSKH & Phí dịch vụ",
  "Giao diện & UI/UX",
  "Giao dịch & Chuyển tiền",
  "Hệ thống & Hiệu năng",
  "Trải nghiệm chung",
  "Tính năng khác",
] as const;

export type CanonicalAspect = (typeof CANONICAL_ASPECTS)[number];

export interface BankMatchResult {
  canonicalName: string | null;
  cleanKeyword: string;
  originalQuery: string;
}

export interface AspectMatchResult {
  canonicalAspect: string | null;
  cleanKeyword: string;
  originalQuery: string;
}

export interface UniversalMatchResult {
  canonicalBank: CanonicalBank | null;
  canonicalAspect: CanonicalAspect | null;
  cleanKeyword: string;
  originalQuery: string;
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* =========================================================================
   1. BANK DEFINITIONS & PATTERNS
   ========================================================================= */

interface BankPattern {
  canonical: CanonicalBank;
  patterns: string[];
}

const BANK_DEFINITIONS: BankPattern[] = [
  {
    canonical: "VCB Digibank",
    patterns: [
      // Full official Vietnamese
      "ngan hang thuong mai co phan ngoai thuong viet nam",
      "ngan hang tmcp ngoai thuong viet nam",
      "ngan hang ngoai thuong viet nam",
      "ngân hàng thương mại cổ phần ngoại thương việt nam",
      "ngân hàng tmcp ngoại thương việt nam",
      "ngân hàng ngoại thương việt nam",
      "ngân hàng ngoại thương",
      "ngan hang ngoai thuong",
      "nh ngoại thương",
      "nh ngoai thuong",
      "ngoại thương",
      "ngoai thuong",
      // Digital app names
      "vietcombank digibank",
      "vietcom bank digibank",
      "viet com bank digibank",
      "vcb digibank",
      "vcb digi",
      "digibank vcb",
      "digibank",
      "digi bank",
      // Brand names & typos
      "vietcombank",
      "vietcom bank",
      "viet com bank",
      "vietcombanh",
      "vietcom",
      "vcombank",
      "vcom bank",
      // App & acronym
      "app vietcombank",
      "app vcb",
      "vcb mobile",
      "vcb",
    ],
  },
  {
    canonical: "MB Bank",
    patterns: [
      // Full official Vietnamese
      "ngan hang thuong mai co phan quan doi",
      "ngan hang tmcp quan doi",
      "ngân hàng thương mại cổ phần quân đội",
      "ngân hàng tmcp quân đội",
      "ngân hàng quân đội",
      "ngan hang quan doi",
      "nh quân đội",
      "nh quan doi",
      "quân đội",
      "quan doi",
      "quân đôi",
      "quan dôi",
      // Brand names & abbreviations
      "ngân hàng mbbank",
      "ngan hang mbbank",
      "ngân hàng mb",
      "ngan hang mb",
      "nh mbbank",
      "nh mb",
      "mb bank",
      "mbbank",
      "mb-bank",
      "m-bank",
      "mbank",
      // Colloquial / phonetic
      "em bi bank",
      "em bi",
      "em pi bank",
      "em pi",
      // App & Stock ticker
      "app mbbank",
      "app mb",
      "mb mobile",
      "mbb",
      "mb",
    ],
  },
  {
    canonical: "BIDV SmartBanking",
    patterns: [
      // Full official Vietnamese
      "ngan hang thuong mai co phan dau tu va phat trien viet nam",
      "ngan hang tmcp dau tu va phat trien",
      "ngân hàng thương mại cổ phần đầu tư và phát triển việt nam",
      "ngân hàng tmcp đầu tư và phát triển",
      "ngân hàng đầu tư và phát triển việt nam",
      "ngân hàng đầu tư và phát triển",
      "ngan hang dau tu va phat trien",
      "ngân hàng đầu tư phát triển",
      "ngan hang dau tu phat trien",
      "ngân hàng đầu tư",
      "ngan hang dau tu",
      "nh đầu tư",
      "nh dau tu",
      "đầu tư và phát triển",
      "dau tu va phat trien",
      "đầu tư phát triển",
      "dau tu phat trien",
      // App & Brand names
      "bidv smartbanking",
      "bidv smart banking",
      "bidv smart-banking",
      "smartbanking bidv",
      "smart banking bidv",
      "smartbanking",
      "smart banking",
      "smart-banking",
      "ngân hàng bidv",
      "ngan hang bidv",
      "nh bidv",
      "bidv bank",
      "app bidv",
      "app smartbanking",
      "bidv",
      "bid",
    ],
  },
  {
    canonical: "VietinBank iPay",
    patterns: [
      // Full official Vietnamese
      "ngan hang thuong mai co phan cong thuong viet nam",
      "ngan hang tmcp cong thuong",
      "ngân hàng thương mại cổ phần công thương việt nam",
      "ngân hàng tmcp công thương",
      "ngân hàng công thương việt nam",
      "ngân hàng công thương",
      "ngan hang cong thuong viet nam",
      "ngan hang cong thuong",
      "nh công thương",
      "nh cong thuong",
      "công thương",
      "cong thuong",
      // App names
      "vietinbank ipay",
      "vietin ipay",
      "viet tin ipay",
      "viettin ipay",
      "viettinbank ipay",
      "ipay vietinbank",
      "ipay vietin",
      "ipay viettin",
      "ipay",
      "i-pay",
      // Brand names & common misspellings (double 'tt')
      "ngân hàng viettinbank",
      "ngan hang viettinbank",
      "ngân hàng vietinbank",
      "ngan hang vietinbank",
      "nh viettinbank",
      "nh vietinbank",
      "viettinbank",
      "viettin bank",
      "viettin",
      "viet tin bank",
      "viet tin",
      "vietinbank",
      "vietin bank",
      "vietin",
      // App & ticker
      "app vietinbank",
      "app viettinbank",
      "app vietin",
      "app ipay",
      "ctg",
    ],
  },
  {
    canonical: "TPBank Mobile",
    patterns: [
      // Full official Vietnamese
      "ngan hang thuong mai co phan tien phong",
      "ngan hang tmcp tien phong",
      "ngân hàng thương mại cổ phần tiên phong",
      "ngân hàng tmcp tiên phong",
      "ngân hàng tiên phong",
      "ngan hang tien phong",
      "nh tiên phong",
      "nh tien phong",
      "tiên phong bank",
      "tien phong bank",
      "tiên phong",
      "tien phong",
      // Brand & App names
      "tpbank mobile",
      "tp bank mobile",
      "tp-bank mobile",
      "ngân hàng tpbank",
      "ngan hang tpbank",
      "nh tpbank",
      "nh tp",
      "tpbank",
      "tp bank",
      "tp-bank",
      "t-p bank",
      "tp mobile",
      "app tpbank",
      "app tp",
      "tpb",
    ],
  },
  {
    canonical: "TNEX",
    patterns: [
      // Digital bank & brand
      "ngân hàng số tnex",
      "ngan hang so tnex",
      "ngân hàng thuần số tnex",
      "ngan hang thuan so tnex",
      "ngân hàng tnex",
      "ngan hang tnex",
      "nh tnex",
      "msb tnex",
      "tnex msb",
      "tnex by msb",
      "app tnex",
      "the nex",
      "t-nex",
      "t nex",
      "tnex",
    ],
  },
  {
    canonical: "Liobank",
    patterns: [
      // Digital bank & brand
      "ngân hàng số liobank",
      "ngan hang so liobank",
      "ngân hàng số lio",
      "ngan hang so lio",
      "ngân hàng liobank",
      "ngan hang liobank",
      "nh liobank",
      "ocb liobank",
      "liobank ocb",
      "liobank by ocb",
      "app liobank",
      "app lio",
      "lyobank",
      "lyo bank",
      "liobank",
      "lio bank",
      "lio-bank",
      "lio",
      "lyo",
    ],
  },
];

/* =========================================================================
   2. ASPECT DEFINITIONS & PATTERNS
   ========================================================================= */

interface AspectPattern {
  canonical: CanonicalAspect;
  patterns: string[];
}

const ASPECT_DEFINITIONS: AspectPattern[] = [
  {
    canonical: "Bảo mật & Đăng nhập",
    patterns: [
      // Full official names
      "bảo mật & đăng nhập",
      "bao mat & dang nhap",
      "bảo mật và đăng nhập",
      "bao mat va dang nhap",
      "đăng nhập & bảo mật",
      "dang nhap & bao mat",
      "đăng nhập & xác thực",
      "dang nhap & xac thuc",
      "đăng nhập và xác thực",
      "dang nhap va xac thuc",
      "bảo mật đăng nhập",
      "bao mat dang nhap",
      "login & authentication",
      "login and authentication",
      // Security
      "bảo mật tài khoản",
      "bao mat tai khoan",
      "an toàn thông tin",
      "an toan thong tin",
      "bảo mật",
      "bao mat",
      "an toàn",
      "an toan",
      // Login & Auth
      "đăng nhập app",
      "dang nhap app",
      "đăng nhập",
      "dang nhap",
      "dangnhap",
      "login",
      "log in",
      "sign in",
      "signin",
      "xác thực tài khoản",
      "xac thuc tai khoan",
      "xác thực",
      "xac thuc",
      "xác minh",
      "xac minh",
      "authentication",
      "auth",
      // Biometrics
      "sinh trắc học",
      "sinh trac hoc",
      "sinh trắc",
      "sinh trac",
      "biometric",
      "biometrics",
      "nhận diện khuôn mặt",
      "nhan dien khuon mat",
      "khuôn mặt",
      "khuon mat",
      "face id",
      "faceid",
      "face-id",
      "dấu vân tay",
      "dau van tay",
      "vân tay",
      "van tay",
      "fingerprint",
      // OTP & Password & Lock
      "smart otp",
      "sms otp",
      "mã otp",
      "ma otp",
      "otp",
      "quên mật khẩu",
      "quen mat khau",
      "đổi mật khẩu",
      "doi mat khau",
      "mật khẩu",
      "mat khau",
      "password",
      "passcode",
      "mã pin",
      "ma pin",
      "khóa tài khoản",
      "khoa tai khoan",
      "khóa thẻ",
      "khoa the",
      "bị khóa",
      "bi khoa",
      "mở khóa",
      "mo khoa",
    ],
  },
  {
    canonical: "CSKH & Phí dịch vụ",
    patterns: [
      // Full official names
      "cskh & phí dịch vụ",
      "cskh & phi dich vu",
      "cskh và phí dịch vụ",
      "cskh va phi dich vu",
      "chăm sóc & hỗ trợ khách hàng",
      "cham soc & ho tro khach hang",
      "chăm sóc khách hàng",
      "cham soc khach hang",
      "cskh",
      "cs kh",
      "customer support",
      "customer care",
      // Support & Hotline
      "hỗ trợ khách hàng",
      "ho tro khach hang",
      "nhân viên hỗ trợ",
      "nhan vien ho tro",
      "tổng đài viên",
      "tong dai vien",
      "tư vấn viên",
      "tu van vien",
      "trực tổng đài",
      "truc tong dai",
      "tổng đài",
      "tong dai",
      "hotline",
      "hỗ trợ",
      "ho tro",
      "support",
      // Fees & Policy
      "biểu phí & chính sách",
      "bieu phi & chinh sach",
      "phí & chính sách",
      "phi & chinh sach",
      "phí dịch vụ",
      "phi dich vu",
      "chính sách phí",
      "chinh sach phi",
      "biểu phí",
      "bieu phi",
      "phí thường niên",
      "phi thuong nien",
      "phí duy trì",
      "phi duy tri",
      "phí quản lý",
      "phi quan ly",
      "phí chuyển tiền",
      "phi chuyen tien",
      "phí tin nhắn",
      "phi tin nhan",
      "phí sms",
      "phi sms",
      "phí phát sinh",
      "phi phat sinh",
      "phí ẩn",
      "phi an",
      "thu phí",
      "thu phi",
      "trừ phí",
      "tru phi",
      "mất phí",
      "mat phi",
      "tốn phí",
      "ton phi",
      "tính phí",
      "tinh phi",
      "phí",
      "phi",
      "fee & policy",
      "service fee",
      "fee",
      "fees",
    ],
  },
  {
    canonical: "Giao diện & UI/UX",
    patterns: [
      // Full official names
      "giao diện & ui/ux",
      "giao dien & ui/ux",
      "giao diện & ui ux",
      "giao dien & ui ux",
      "giao diện và ui/ux",
      "giao dien va ui/ux",
      "giao diện và ui ux",
      "giao dien va ui ux",
      "giao diện người dùng",
      "giao dien nguoi dung",
      "giao diện app",
      "giao dien app",
      "giao diện",
      "giao dien",
      "ui/ux",
      "ui-ux",
      "ui ux",
      "ui",
      "ux",
      // Visual & Experience
      "bố cục",
      "bo cuc",
      "màu sắc",
      "mau sac",
      "phông chữ",
      "phong chu",
      "font chữ",
      "font chu",
      "chữ nhỏ",
      "chu nho",
      "chữ to",
      "chu to",
      "dễ nhìn",
      "de nhin",
      "khó nhìn",
      "kho nhin",
      "rối mắt",
      "roi mat",
      "chói mắt",
      "choi mat",
      "loá mắt",
      "loa mat",
      "trực quan",
      "truc quan",
      "thẩm mỹ",
      "tham my",
      "đẹp mắt",
      "dep mat",
      "bắt mắt",
      "bat mat",
      "hiện đại",
      "hien dai",
      "thân thiện",
      "than thien",
      "dễ dùng",
      "de dung",
      "dễ sử dụng",
      "de su dung",
      "khó dùng",
      "kho dung",
      "dark mode",
      "giao diện tối",
      "giao dien toi",
      "chế độ tối",
      "che do toi",
      "theme",
      "layout",
      "design",
    ],
  },
  {
    canonical: "Giao dịch & Chuyển tiền",
    patterns: [
      // Full official names
      "giao dịch & chuyển tiền",
      "giao dich & chuyen tien",
      "giao dịch và chuyển tiền",
      "giao dich va chuyen tien",
      "chuyển tiền & giao dịch",
      "chuyen tien & giao dich",
      "chuyển khoản & giao dịch",
      "chuyen khoan & giao dich",
      "transaction & transfer",
      "transfer & transaction",
      // Transfer methods
      "chuyển liên ngân hàng",
      "chuyen lien ngan hang",
      "chuyển nhanh 247",
      "chuyen nhanh 247",
      "chuyển 247",
      "chuyen 247",
      "napas 247",
      "napas",
      "chuyển nội bộ",
      "chuyen noi bo",
      "chuyển khoản",
      "chuyen khoan",
      "chuyển tiền",
      "chuyen tien",
      "bắn tiền",
      "ban tien",
      "gửi tiền",
      "gui tien",
      "nhận tiền",
      "nhan tien",
      "ck",
      // Deposit / Withdraw / Payment
      "nạp rút tiền",
      "nap rut tien",
      "nạp rút",
      "nap rut",
      "nạp tiền",
      "nap tien",
      "rút tiền",
      "rut tien",
      "quét mã qr",
      "quet ma qr",
      "quét qr",
      "quet qr",
      "quét mã",
      "quet ma",
      "mã qr",
      "ma qr",
      "qr code",
      "qrcode",
      "vietqr",
      "giao dịch",
      "giao dich",
      "thanh toán",
      "thanh toan",
      "transfer",
      "transaction",
      "payment",
    ],
  },
  {
    canonical: "Hệ thống & Hiệu năng",
    patterns: [
      // Full official names
      "hệ thống & hiệu năng",
      "he thong & hieu nang",
      "hệ thống và hiệu năng",
      "he thong va hieu nang",
      "hiệu năng & tốc độ",
      "hieu nang & toc do",
      "hiệu năng và tốc độ",
      "hieu nang va toc do",
      "hiệu năng",
      "hieu nang",
      "hệ thống",
      "he thong",
      "performance",
      "system",
      // Speed / Slowness
      "tốc độ tải",
      "toc do tai",
      "tốc độ",
      "toc do",
      "tải chậm",
      "tai cham",
      "load chậm",
      "load cham",
      "chậm chạp",
      "cham chap",
      "rùa bò",
      "rua bo",
      "chậm",
      "cham",
      // Lag / Freeze / Hang
      "giật lag",
      "giat lag",
      "lag giật",
      "lag giat",
      "lag",
      "giật",
      "giat",
      "bị đơ",
      "bi do",
      "đơ máy",
      "do may",
      "đơ",
      "do",
      "treo app",
      "treo máy",
      "treo may",
      "treo",
      "đứng hình",
      "dung hinh",
      // Crash / Out / Server error
      "văng app",
      "vang app",
      "bị văng",
      "bi vang",
      "văng",
      "vang",
      "out app",
      "bị out",
      "bi out",
      "sập app",
      "sap app",
      "sập",
      "sap",
      "crash",
      "app crash",
      "bảo trì hệ thống",
      "bao tri he thong",
      "bảo trì",
      "bao tri",
      "lỗi hệ thống",
      "loi he thong",
      "máy chủ",
      "may chu",
      "lỗi server",
      "loi server",
      "server",
      "mất kết nối",
      "mat ket noi",
      // Device impact
      "nóng máy",
      "nong may",
      "ngốn pin",
      "ngon pin",
      "hao pin",
      "tốn pin",
      "ton pin",
      "nặng máy",
      "nang may",
      // Smooth / Stability
      "mượt mà ổn định",
      "muot ma on dinh",
      "mượt mà",
      "muot ma",
      "mượt",
      "muot",
      "ổn định",
      "on dinh",
      "smooth",
      "speed",
    ],
  },
  {
    canonical: "Trải nghiệm chung",
    patterns: [
      // Full official names
      "trải nghiệm người dùng",
      "trai nghiem nguoi dung",
      "trải nghiệm tổng thể",
      "trai nghiem tong the",
      "trải nghiệm chung",
      "trai nghiem chung",
      "trải nghiệm",
      "trai nghiem",
      "đánh giá chung",
      "danh gia chung",
      "nhận xét chung",
      "nhan xet chung",
      "tổng thể",
      "tong the",
      "tổng quan",
      "tong quan",
      "overall",
      "general experience",
      // Sentiments / satisfaction
      "rất hài lòng",
      "rat hai long",
      "không hài lòng",
      "khong hai long",
      "hài lòng",
      "hai long",
      "thất vọng",
      "that vong",
      "tuyệt vời",
      "tuyet voi",
      "xuất sắc",
      "xuat sac",
      "quá tệ",
      "qua te",
      "tệ hại",
      "te hai",
      "bực mình",
      "buc minh",
      "ức chế",
      "uc che",
      "dịch vụ tốt",
      "dich vu tot",
      "rất tốt",
      "rat tot",
      "rất thích",
      "rat thich",
      "ưng ý",
      "ung y",
      "ổn áp",
      "on ap",
      "tàm tạm",
      "tam tam",
      "tạm ổn",
      "tam on",
    ],
  },
  {
    canonical: "Tính năng khác",
    patterns: [
      // Full official names
      "tính năng khác",
      "tinh nang khac",
      "tiện ích khác",
      "tien ich khac",
      "dịch vụ khác",
      "dich vu khac",
      "các tính năng",
      "cac tinh nang",
      "tính năng",
      "tinh nang",
      "tiện ích",
      "tien ich",
      "feature",
      "features",
      "utility",
      "utilities",
      // Specific financial services
      "sổ tiết kiệm",
      "so tiet kiem",
      "gửi tiết kiệm",
      "gui tiet kiem",
      "tiết kiệm",
      "tiet kiem",
      "vay tiêu dùng",
      "vay tieu dung",
      "khoản vay",
      "khoan vay",
      "vay tiền",
      "vay tien",
      "vay vốn",
      "vay von",
      "thẻ tín dụng",
      "the tin dung",
      "tín dụng",
      "tin dung",
      "credit card",
      "bảo hiểm",
      "bao hiem",
      "chứng khoán",
      "chung khoan",
      "đầu tư",
      "dau tu",
      // Utility payments
      "thanh toán hóa đơn",
      "thanh toan hoa don",
      "hóa đơn tiền điện",
      "hoa don tien dien",
      "tiền điện",
      "tien dien",
      "tiền nước",
      "tien nuoc",
      "mua vé máy bay",
      "mua ve may bay",
      "vé máy bay",
      "ve may bay",
      "đặt vé",
      "dat ve",
      "đặt phòng",
      "dat phong",
      "mua vé xem phim",
      "mua ve xem phim",
      "nạp tiền điện thoại",
      "nap tien dien thoai",
      "nạp thẻ cào",
      "nap the cao",
      "mua thẻ cào",
      "mua the cao",
      "nạp 4g",
      "nap 4g",
    ],
  },
];

/* =========================================================================
   3. COMMON FILLER WORDS TO STRIP
   ========================================================================= */

const FILLER_WORDS = [
  "review",
  "reviews",
  "danh gia",
  "đánh giá",
  "nhan xet",
  "nhận xét",
  "binh luan",
  "bình luận",
  "tim kiem",
  "tìm kiếm",
  "tra cuu",
  "tra cứu",
  "xem",
  "tim",
  "tìm",
  "cho xem",
  "kiem tra",
  "kiểm tra",
  "thong tin",
  "thông tin",
  "app",
  "ung dung",
  "ứng dụng",
  "ngan hang",
  "ngân hàng",
  "bank",
  "nh",
  "khia canh",
  "khía cạnh",
  "cua",
  "của",
  "ve",
  "về",
  "tai",
  "tại",
  "o",
  "ở",
  "phan tich",
  "phân tích",
  "doi voi",
  "đối với",
];

/* =========================================================================
   4. FLATTENED & SORTED PATTERNS
   ========================================================================= */

interface FlatBankPattern {
  canonical: CanonicalBank;
  pattern: string;
  unaccentedPattern: string;
  wordCount: number;
}

const ALL_BANK_PATTERNS: FlatBankPattern[] = BANK_DEFINITIONS.flatMap((bank) =>
  bank.patterns.map((p) => {
    const unaccented = removeVietnameseTones(p).trim();
    return {
      canonical: bank.canonical,
      pattern: p.toLowerCase().trim(),
      unaccentedPattern: unaccented,
      wordCount: unaccented.split(/\s+/).length,
    };
  })
).sort((a, b) => {
  if (b.unaccentedPattern.length !== a.unaccentedPattern.length) {
    return b.unaccentedPattern.length - a.unaccentedPattern.length;
  }
  return b.wordCount - a.wordCount;
});

interface FlatAspectPattern {
  canonical: CanonicalAspect;
  pattern: string;
  unaccentedPattern: string;
  wordCount: number;
  priority: number; // Functional aspects have higher priority than generic experience
}

const ALL_ASPECT_PATTERNS: FlatAspectPattern[] = ASPECT_DEFINITIONS.flatMap((asp) =>
  asp.patterns.map((p) => {
    const unaccented = removeVietnameseTones(p).trim();
    // Prioritize functional aspects over general sentiment expressions
    const isGeneral = asp.canonical === "Trải nghiệm chung";
    return {
      canonical: asp.canonical,
      pattern: p.toLowerCase().trim(),
      unaccentedPattern: unaccented,
      wordCount: unaccented.split(/\s+/).length,
      priority: isGeneral ? 0 : 1,
    };
  })
).sort((a, b) => {
  // Functional aspects first
  if (b.priority !== a.priority) {
    return b.priority - a.priority;
  }
  // Then longest patterns first
  if (b.unaccentedPattern.length !== a.unaccentedPattern.length) {
    return b.unaccentedPattern.length - a.unaccentedPattern.length;
  }
  return b.wordCount - a.wordCount;
});

/* =========================================================================
   5. MATCHING & RESOLUTION FUNCTIONS
   ========================================================================= */

/**
 * Resolves bank aliases from user query.
 */
export function resolveBankSearch(rawInput: string): BankMatchResult {
  const universal = resolveUniversalSearch(rawInput, "banks");
  return {
    canonicalName: universal.canonicalBank,
    cleanKeyword: universal.cleanKeyword,
    originalQuery: rawInput,
  };
}

/**
 * Resolves aspect aliases from user query.
 */
export function resolveAspectSearch(rawInput: string): AspectMatchResult {
  const universal = resolveUniversalSearch(rawInput, "aspects");
  return {
    canonicalAspect: universal.canonicalAspect,
    cleanKeyword: universal.cleanKeyword,
    originalQuery: rawInput,
  };
}

/**
 * Unified resolver that detects BOTH bank and aspect mentions from any user query.
 * Extracts matched bank, matched aspect, and leaves only the meaningful remaining keywords.
 */
export function resolveUniversalSearch(
  rawInput: string,
  preferredFocus: "banks" | "aspects" = "banks"
): UniversalMatchResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      canonicalBank: null,
      canonicalAspect: null,
      cleanKeyword: "",
      originalQuery: rawInput,
    };
  }

  let unaccentedRaw = removeVietnameseTones(trimmed);
  let remainingQuery = trimmed;

  let matchedBank: CanonicalBank | null = null;
  let matchedAspect: CanonicalAspect | null = null;

  // 1. Detect Bank
  for (const item of ALL_BANK_PATTERNS) {
    const escaped = escapeRegex(item.unaccentedPattern);
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");

    if (regex.test(unaccentedRaw)) {
      matchedBank = item.canonical;
      const index = unaccentedRaw.indexOf(item.unaccentedPattern);
      if (index !== -1) {
        const before = remainingQuery.slice(0, index);
        const after = remainingQuery.slice(index + item.unaccentedPattern.length);
        remainingQuery = `${before} ${after}`.replace(/\s+/g, " ").trim();
        unaccentedRaw = removeVietnameseTones(remainingQuery);
      }
      break;
    }
  }

  // 2. Detect Aspect
  for (const item of ALL_ASPECT_PATTERNS) {
    const escaped = escapeRegex(item.unaccentedPattern);
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");

    if (regex.test(unaccentedRaw)) {
      matchedAspect = item.canonical;
      const index = unaccentedRaw.indexOf(item.unaccentedPattern);
      if (index !== -1) {
        const before = remainingQuery.slice(0, index);
        const after = remainingQuery.slice(index + item.unaccentedPattern.length);
        remainingQuery = `${before} ${after}`.replace(/\s+/g, " ").trim();
        unaccentedRaw = removeVietnameseTones(remainingQuery);
      }
      break;
    }
  }

  // 3. Clean remaining query from redundant aliases & filler words
  let cleanKeyword = remainingQuery.replace(/^[\s,.:;!?'"()\-–—]+|[\s,.:;!?'"()\-–—]+$/g, "").trim();

  if (cleanKeyword) {
    let unaccentedRemaining = removeVietnameseTones(cleanKeyword);

    // Strip redundant bank aliases in remaining
    for (const item of ALL_BANK_PATTERNS) {
      const escaped = escapeRegex(item.unaccentedPattern);
      const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "gi");
      if (regex.test(unaccentedRemaining)) {
        unaccentedRemaining = unaccentedRemaining.replace(regex, " ").replace(/\s+/g, " ").trim();
        cleanKeyword = cleanKeyword.replace(regex, " ").replace(/\s+/g, " ").trim();
      }
    }

    // Strip redundant aspect aliases in remaining
    for (const item of ALL_ASPECT_PATTERNS) {
      const escaped = escapeRegex(item.unaccentedPattern);
      const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "gi");
      if (regex.test(unaccentedRemaining)) {
        unaccentedRemaining = unaccentedRemaining.replace(regex, " ").replace(/\s+/g, " ").trim();
        cleanKeyword = cleanKeyword.replace(regex, " ").replace(/\s+/g, " ").trim();
      }
    }

    // Strip generic filler words
    for (const filler of FILLER_WORDS) {
      const fillerRegex = new RegExp(`(^|[^a-z0-9])${escapeRegex(filler)}([^a-z0-9]|$)`, "gi");
      if (fillerRegex.test(unaccentedRemaining)) {
        unaccentedRemaining = unaccentedRemaining.replace(fillerRegex, " ").replace(/\s+/g, " ").trim();
        cleanKeyword = cleanKeyword.replace(fillerRegex, " ").replace(/\s+/g, " ").trim();
      }
    }

    // Clean leading/trailing punctuation again after removal
    cleanKeyword = cleanKeyword.replace(/^[\s,.:;!?'"()\-–—]+|[\s,.:;!?'"()\-–—]+$/g, "").trim();

    // If remaining is empty or only special chars, reset cleanKeyword
    if (!cleanKeyword || unaccentedRemaining.replace(/[^a-z0-9]/g, "").length < 2) {
      cleanKeyword = "";
    }
  }

  return {
    canonicalBank: matchedBank,
    canonicalAspect: matchedAspect,
    cleanKeyword: cleanKeyword.trim(),
    originalQuery: rawInput,
  };
}
