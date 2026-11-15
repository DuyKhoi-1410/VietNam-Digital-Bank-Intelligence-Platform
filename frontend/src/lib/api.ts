import {
  HealthResponse,
  MarketOverviewResponse,
  MarketTrendsResponse,
  MarketAspectsResponse,
  BankListItem,
  BankScorecard,
  BankAspectsResponse,
  BankVersionsResponse,
  BankQuotesResponse,
  BenchmarkMatrixResponse,
  AspectBenchmarkResponse,
  RatingBenchmarkResponse,
  PaginatedReviewsResponse,
  ReviewDetailResponse,
  FilterOptionsResponse,
  ExportFormat,
} from "@/types";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      let errDetail = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          errDetail = typeof errJson.detail === "string" ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {
        // use default statusText
      }
      throw new ApiError(res.status, errDetail);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error(`Failed to communicate with backend API at ${url}. ${err instanceof Error ? err.message : String(err)}`);
  }
}

export const api = {
  // System Health
  async getHealth(): Promise<HealthResponse> {
    return fetchFromApi<HealthResponse>("/health");
  },

  // Module 1: Market Overview
  async getMarketOverview(): Promise<MarketOverviewResponse> {
    return fetchFromApi<MarketOverviewResponse>("/api/v1/market/overview");
  },

  async getMarketTrends(): Promise<MarketTrendsResponse> {
    return fetchFromApi<MarketTrendsResponse>("/api/v1/market/trends");
  },

  async getMarketAspects(): Promise<MarketAspectsResponse> {
    return fetchFromApi<MarketAspectsResponse>("/api/v1/market/aspects");
  },

  // Module 2: Bank Insights
  async getBanksList(): Promise<BankListItem[]> {
    const data = await fetchFromApi<any>("/api/v1/banks");
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.banks)) return data.banks;
    return [];
  },

  async getBankScorecard(bankName: string): Promise<BankScorecard> {
    return fetchFromApi<BankScorecard>(`/api/v1/banks/${encodeURIComponent(bankName)}/scorecard`);
  },

  async getBankAspects(bankName: string): Promise<BankAspectsResponse> {
    return fetchFromApi<BankAspectsResponse>(`/api/v1/banks/${encodeURIComponent(bankName)}/aspects`);
  },

  async getBankVersions(bankName: string): Promise<BankVersionsResponse> {
    return fetchFromApi<BankVersionsResponse>(`/api/v1/banks/${encodeURIComponent(bankName)}/versions`);
  },

  async getBankQuotes(
    bankName: string,
    aspect?: string,
    sentiment?: string,
    limit: number = 5
  ): Promise<BankQuotesResponse> {
    const params = new URLSearchParams();
    if (aspect) params.append("aspect", aspect);
    if (sentiment) params.append("sentiment", sentiment);
    params.append("limit", limit.toString());
    return fetchFromApi<BankQuotesResponse>(
      `/api/v1/banks/${encodeURIComponent(bankName)}/quotes?${params.toString()}`
    );
  },

  // Module 3: Competitive Benchmark
  async getBenchmarkMatrix(banks?: string[]): Promise<BenchmarkMatrixResponse> {
    const params = new URLSearchParams();
    if (banks && banks.length > 0) {
      banks.forEach((b) => params.append("banks", b));
    }
    const qs = params.toString() ? `?${params.toString()}` : "";
    return fetchFromApi<BenchmarkMatrixResponse>(`/api/v1/benchmark/matrix${qs}`);
  },

  async getAspectBenchmark(): Promise<AspectBenchmarkResponse> {
    return fetchFromApi<AspectBenchmarkResponse>("/api/v1/benchmark/aspects");
  },

  async getRatingBenchmark(): Promise<RatingBenchmarkResponse> {
    return fetchFromApi<RatingBenchmarkResponse>("/api/v1/benchmark/ratings");
  },

  // Module 4: Review Explorer
  async searchReviews(filters: {
    bank?: string;
    rating?: number;
    sentiment?: string;
    aspect?: string;
    app_version?: string;
    keyword?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedReviewsResponse> {
    const params = new URLSearchParams();
    if (filters.bank) params.append("bank", filters.bank);
    if (filters.rating !== undefined) params.append("rating", filters.rating.toString());
    if (filters.sentiment) params.append("sentiment", filters.sentiment);
    if (filters.aspect) params.append("aspect", filters.aspect);
    if (filters.app_version) params.append("app_version", filters.app_version);
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.page_size) params.append("page_size", filters.page_size.toString());

    return fetchFromApi<PaginatedReviewsResponse>(`/api/v1/reviews/search?${params.toString()}`);
  },

  async getReviewDetail(reviewId: string): Promise<ReviewDetailResponse> {
    return fetchFromApi<ReviewDetailResponse>(`/api/v1/reviews/${encodeURIComponent(reviewId)}`);
  },

  async getFilterOptions(): Promise<FilterOptionsResponse> {
    return fetchFromApi<FilterOptionsResponse>("/api/v1/reviews/filters/options");
  },

  // Module 5: Export URLs
  getSummaryExportUrl(tableType: string, format: ExportFormat = "csv"): string {
    return `${API_BASE_URL}/api/v1/reports/summary-tables?table_type=${encodeURIComponent(
      tableType
    )}&export_format=${format}`;
  },

  getReviewsExportUrl(filters: {
    bank?: string;
    rating?: number;
    sentiment?: string;
    aspect?: string;
    limit?: number;
    format?: ExportFormat;
  }): string {
    const params = new URLSearchParams();
    if (filters.bank) params.append("bank", filters.bank);
    if (filters.rating) params.append("rating", filters.rating.toString());
    if (filters.sentiment) params.append("sentiment", filters.sentiment);
    if (filters.aspect) params.append("aspect", filters.aspect);
    if (filters.limit) params.append("limit", filters.limit.toString());
    params.append("export_format", filters.format || "csv");
    return `${API_BASE_URL}/api/v1/reports/reviews/export?${params.toString()}`;
  },
};
