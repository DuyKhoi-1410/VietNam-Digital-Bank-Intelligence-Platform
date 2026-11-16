/**
 * Bank Name Matching & Alias Resolution Engine for Vietnam Digital Banking Intelligence
 * 
 * Handles all spelling variations, abbreviations, common misspellings,
 * informal naming conventions, stock tickers, and diacritic-free queries
 * for the 7 commercial banks in the dataset.
 */

export interface BankMatchResult {
  canonicalName: string | null;
  cleanKeyword: string;
  originalQuery: string;
}

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

export function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();
}

/**
 * Definition of banks with their canonical BigQuery name and exhaustive alias patterns.
 * Sorted internally by pattern length descending to match longest phrases first.
 */
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

// Filler words to strip if only a bank name + intent words were entered
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
  "cua",
  "của",
  "ve",
  "về",
  "tai",
  "tại",
  "o",
  "ở",
];

// Flatten all pattern entries and sort by pattern length descending
interface FlatPattern {
  canonical: CanonicalBank;
  pattern: string;
  unaccentedPattern: string;
  wordCount: number;
}

const ALL_PATTERNS: FlatPattern[] = BANK_DEFINITIONS.flatMap((bank) =>
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
  // Sort primarily by character length descending, then word count descending
  if (b.unaccentedPattern.length !== a.unaccentedPattern.length) {
    return b.unaccentedPattern.length - a.unaccentedPattern.length;
  }
  return b.wordCount - a.wordCount;
});

/**
 * Escapes regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Resolves a user's search input to:
 * 1. A canonical bank (if any bank variation is found)
 * 2. A clean keyword (any remaining topical search term, with filler words cleaned)
 */
export function resolveBankSearch(rawInput: string): BankMatchResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      canonicalName: null,
      cleanKeyword: "",
      originalQuery: rawInput,
    };
  }

  const lowerRaw = trimmed.toLowerCase();
  const unaccentedRaw = removeVietnameseTones(trimmed);

  let matchedBank: CanonicalBank | null = null;
  let remainingQuery = trimmed;

  for (const item of ALL_PATTERNS) {
    // Check with word boundary regex
    // For single/short words like "mb", "bid", "lio", "tpb", boundary check is vital
    const escapedPattern = escapeRegex(item.unaccentedPattern);
    const regex = new RegExp(`(^|[^a-z0-9])${escapedPattern}([^a-z0-9]|$)`, "i");

    const matchUnaccented = unaccentedRaw.match(regex);
    if (matchUnaccented) {
      matchedBank = item.canonical;

      // Extract the matching span from the original raw string
      // by finding the offset in unaccentedRaw
      const index = unaccentedRaw.indexOf(item.unaccentedPattern);
      if (index !== -1) {
        const before = trimmed.slice(0, index);
        const after = trimmed.slice(index + item.unaccentedPattern.length);
        remainingQuery = `${before} ${after}`.replace(/\s+/g, " ").trim();
      }
      break;
    }
  }

  // Clean remaining query from common filler words and leftover bank aliases if present
  let cleanKeyword = remainingQuery.replace(/^[\s,.:;!?'"()\-–—]+|[\s,.:;!?'"()\-–—]+$/g, "").trim();

  if (cleanKeyword) {
    let unaccentedRemaining = removeVietnameseTones(cleanKeyword);

    // If there is another redundant alias of the same or any bank in parentheses/remaining (e.g. "(vcb)", "bank")
    for (const item of ALL_PATTERNS) {
      const escapedPattern = escapeRegex(item.unaccentedPattern);
      const regex = new RegExp(`(^|[^a-z0-9])${escapedPattern}([^a-z0-9]|$)`, "gi");
      if (regex.test(unaccentedRemaining)) {
        unaccentedRemaining = unaccentedRemaining.replace(regex, " ").replace(/\s+/g, " ").trim();
        cleanKeyword = cleanKeyword.replace(new RegExp(`(^|[^a-z0-9])${escapedPattern}([^a-z0-9]|$)`, "gi"), " ").replace(/\s+/g, " ").trim();
      }
    }

    // Strip generic filler words
    for (const filler of FILLER_WORDS) {
      const fillerRegex = new RegExp(`(^|[^a-z0-9])${escapeRegex(filler)}([^a-z0-9]|$)`, "gi");
      if (fillerRegex.test(unaccentedRemaining)) {
        unaccentedRemaining = unaccentedRemaining.replace(fillerRegex, " ").replace(/\s+/g, " ").trim();
        cleanKeyword = cleanKeyword.replace(new RegExp(`(^|[^a-z0-9])${escapeRegex(filler)}([^a-z0-9]|$)`, "gi"), " ").replace(/\s+/g, " ").trim();
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
    canonicalName: matchedBank,
    cleanKeyword: cleanKeyword.trim(),
    originalQuery: rawInput,
  };
}
