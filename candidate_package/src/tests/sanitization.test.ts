import { describe, expect, it } from "vitest";
import {
  asPlainRecord,
  containsPotentialSqlInjection,
  containsPotentialXss,
  coerceToSafeDisplayString,
  forceToBoolean,
  forceToNumber,
  sanitizeUnknownDeep,
  sanitizeSqlIdentifier,
  sanitizeSqlParameter,
  toSafeNonEmptyString,
  toSafeStringFromStringOrNumber,
  validateStringValue,
  validateValueType,
} from "../utils/sanitization";

describe("sanitization utilities", () => {
  it("detects direct and obfuscated XSS payloads", () => {
    const direct = "<script>alert(1)</script>";
    const obfuscated = "%3Cscript%3Ealert(1)%3C%2Fscript%3E";

    expect(containsPotentialXss(direct)).toBe(true);
    expect(containsPotentialXss(obfuscated)).toBe(true);
  });

  it("detects SQL injection patterns", () => {
    const payload = "' OR 1=1 --";
    expect(containsPotentialSqlInjection(payload)).toBe(true);
    expect(sanitizeSqlParameter(payload)).toBeNull();
  });

  it("sanitizes dangerous HTML fragments for display", () => {
    const input = "<img src=x onerror=alert(1)>hello";
    const result = coerceToSafeDisplayString(input);

    expect(result).toBe("hello");
  });

  it("validates and sanitizes SQL identifier with allowlist", () => {
    expect(sanitizeSqlIdentifier("users_table")).toBe("users_table");
    expect(sanitizeSqlIdentifier("users; DROP TABLE users")).toBeNull();
  });

  it("validates type and force conversion", () => {
    expect(validateValueType("abc", "string")).toBe(true);
    expect(validateValueType(["a"], "array")).toBe(true);
    expect(asPlainRecord({ a: 1 })).toEqual({ a: 1 });
    expect(asPlainRecord(["a"])).toBeNull();
    expect(toSafeNonEmptyString("  ok  ")).toBe("ok");
    expect(toSafeStringFromStringOrNumber(99)).toBe("99");
    expect(forceToNumber("42.2", { integer: true })).toBe(42);
    expect(forceToBoolean("yes")).toBe(true);
  });

  it("validates safe string with policy and rejects threats", () => {
    expect(
      validateStringValue("safe_input-123", {
        pattern: /^[A-Za-z0-9_-]+$/,
        rejectThreatPayloads: true,
      }),
    ).toBe(true);

    expect(
      validateStringValue("<script>alert(1)</script>", {
        rejectThreatPayloads: true,
      }),
    ).toBe(false);
  });

  it("sanitizes unknown nested values deeply", () => {
    const sanitized = sanitizeUnknownDeep({
      name: "<b>John</b>",
      tags: ["ok", "<svg/onload=alert(1)>"],
      active: "true",
    }) as Record<string, unknown>;

    expect(typeof sanitized).toBe("object");
    expect(sanitized.name).toBe("John");
    expect(Array.isArray(sanitized.tags)).toBe(true);
  });
});
