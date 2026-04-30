import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Minimal RSS XML ────────────────────────────────────────────────────────────

const VALID_RSS = `<?xml version="1.0"?><rss version="2.0"><channel><title>Test Feed</title><item><title>Glow Skin Revolution</title><description>The skincare world is shifting.</description><link>https://example.com/article</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate></item></channel></rss>`;

const MARKET_RSS = `<?xml version="1.0"?><rss version="2.0"><channel><title>Market Feed</title><item><title>Beauty Industry Revenue Growth</title><description>The beauty market is experiencing explosive revenue growth.</description><link>https://example.com/market</link><pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate></item></channel></rss>`;

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeOkResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}

function makeErrorResponse(): Response {
  return new Response("Not Found", { status: 404 });
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("scrapeAll()", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fetch for each of the 3 feed URLs", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeOkResponse(VALID_RSS));
    vi.stubGlobal("fetch", mockFetch);

    // Re-import scraper fresh to avoid module cache bleed
    const { scrapeAll } = await import("@/lib/beauty-signals/scraper");
    await scrapeAll();

    expect(mockFetch).toHaveBeenCalledTimes(3);

    const calledUrls = (mockFetch.mock.calls as [string, ...unknown[]][]).map((call) => call[0]);
    expect(calledUrls).toContain("https://www.allure.com/feed/rss");
    expect(calledUrls).toContain("https://wwd.com/feed/");
    expect(calledUrls).toContain("https://beautymatter.com/feed");
  });

  it("returns an array of BeautySignal objects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeOkResponse(VALID_RSS)));

    const { scrapeAll } = await import("@/lib/beauty-signals/scraper");
    const signals = await scrapeAll();

    expect(Array.isArray(signals)).toBe(true);
    if (signals.length > 0) {
      const [s] = signals;
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("slug");
      expect(s).toHaveProperty("headline");
      expect(s).toHaveProperty("category");
      expect(s).toHaveProperty("body");
    }
  });

  it("if one feed throws, the other feeds still succeed (resilience)", async () => {
    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      callCount++;
      // Fail the first URL (Allure), succeed for the others
      if (url === "https://www.allure.com/feed/rss") {
        throw new Error("Network error: feed unavailable");
      }
      return makeOkResponse(VALID_RSS);
    });
    vi.stubGlobal("fetch", mockFetch);

    const { scrapeAll } = await import("@/lib/beauty-signals/scraper");
    const signals = await scrapeAll();

    // Should not throw, and should return signals from the 2 successful feeds
    expect(Array.isArray(signals)).toBe(true);
    expect(callCount).toBe(3);
    // At least 1 signal from the 2 successful feeds
    expect(signals.length).toBeGreaterThanOrEqual(1);
  });

  it("if a feed returns 404, it is skipped gracefully", async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === "https://wwd.com/feed/") {
        return makeErrorResponse();
      }
      return makeOkResponse(VALID_RSS);
    });
    vi.stubGlobal("fetch", mockFetch);

    const { scrapeAll } = await import("@/lib/beauty-signals/scraper");

    await expect(scrapeAll()).resolves.not.toThrow();
    const signals = await scrapeAll();
    expect(Array.isArray(signals)).toBe(true);
  });

  it("scrapeAll() bypasses cache (always fetches fresh)", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeOkResponse(VALID_RSS));
    vi.stubGlobal("fetch", mockFetch);

    const { scrapeAll } = await import("@/lib/beauty-signals/scraper");
    await scrapeAll();
    await scrapeAll();

    // scrapeAll always fetches — 3 feeds × 2 calls = 6
    expect(mockFetch).toHaveBeenCalledTimes(6);
  });
});

describe("getSignals()", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("returns cached data when called twice within TTL (fetch called only once per feed set)", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeOkResponse(VALID_RSS));
    vi.stubGlobal("fetch", mockFetch);

    // Fresh module import to guarantee an empty cache
    const { getSignals } = await import("@/lib/beauty-signals/scraper");

    await getSignals();
    await getSignals();

    // First call fetches 3 feeds. Second call should use cache → still 3 total.
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("returns an array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeOkResponse(MARKET_RSS)));

    const { getSignals } = await import("@/lib/beauty-signals/scraper");
    const signals = await getSignals();
    expect(Array.isArray(signals)).toBe(true);
  });

  it("returns [] gracefully when all feeds fail", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("All feeds down")));

    const { getSignals } = await import("@/lib/beauty-signals/scraper");
    const signals = await getSignals();
    expect(signals).toEqual([]);
  });
});
