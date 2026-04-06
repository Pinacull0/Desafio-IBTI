export type SupportedType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null"
  | "undefined";

export interface StringSanitizationOptions {
  required?: boolean;
  allowEmpty?: boolean;
  trim?: boolean;
  maxLength?: number;
  minLength?: number;
  escapeHtml?: boolean;
}

export interface NumberCoercionOptions {
  min?: number;
  max?: number;
  integer?: boolean;
}

export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  rejectThreatPayloads?: boolean;
}

export interface SafeStringOptions {
  maxLength?: number;
  minLength?: number;
  allowEmpty?: boolean;
}

const INVISIBLE_OR_CONTROL_CHARS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;

const SQLI_PATTERNS: RegExp[] = [
  /\bunion\b[\s\S]*\bselect\b/i,
  /\bor\b\s+1\s*=\s*1\b/i,
  /\b(drop|truncate|alter)\b[\s\S]*\b(table|database)\b/i,
  /\b(delete|update|insert)\b[\s\S]*\b(from|into|set)\b/i,
  /(--|#|\/\*|\*\/)/,
  /\b(exec|execute|xp_cmdshell|information_schema|sleep|benchmark)\b/i,
  /;\s*(drop|delete|update|insert|alter)\b/i,
];

const XSS_PATTERNS: RegExp[] = [
  /<\s*script\b/i,
  /<\s*\/\s*script/i,
  /\bon\w+\s*=/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /<\s*(iframe|svg|math|object|embed|link|meta|style)\b/i,
  /srcdoc\s*=/i,
  /expression\s*\(/i,
  /document\.(cookie|write)/i,
];

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function getValueType(value: unknown): SupportedType {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value as SupportedType;
}

export function validateValueType(
  value: unknown,
  expectedType: SupportedType,
): boolean {
  return getValueType(value) === expectedType;
}

export function asPlainRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function validateValue(
  value: unknown,
  predicate: (candidate: unknown) => boolean,
): boolean {
  try {
    return predicate(value);
  } catch {
    return false;
  }
}

export function forceToString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value === null || value === undefined) {
    return "";
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function forceToNumber(
  value: unknown,
  options: NumberCoercionOptions = {},
): number | null {
  const raw =
    typeof value === "number" ? value : Number.parseFloat(forceToString(value));

  if (!Number.isFinite(raw)) {
    return null;
  }

  let coerced = options.integer ? Math.trunc(raw) : raw;

  if (options.min !== undefined) {
    coerced = Math.max(options.min, coerced);
  }
  if (options.max !== undefined) {
    coerced = Math.min(options.max, coerced);
  }

  return coerced;
}

export function forceToBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }

  const normalized = forceToString(value).trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }
  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }
  return normalized.length > 0;
}

export function sanitizeText(
  value: unknown,
  options: StringSanitizationOptions = {},
): string | null {
  const {
    required = false,
    allowEmpty = false,
    trim = true,
    maxLength = 5000,
    minLength = 1,
    escapeHtml = false,
  } = options;

  let text = forceToString(value);

  text = normalizeInput(text);
  const canonical = canonicalizeForInspection(text);
  const hasThreats =
    containsPotentialXss(canonical) || containsPotentialSqlInjection(canonical);

  if (hasThreats) {
    text = neutralizeDangerousPayload(text);
  }

  text = trim ? text.trim() : text;
  if (text.length > maxLength) {
    text = text.slice(0, maxLength);
  }

  if (!allowEmpty && text.length < minLength) {
    return required ? null : null;
  }

  return escapeHtml ? escapeHtmlEntities(text) : text;
}

export function containsPotentialXss(value: string): boolean {
  const canonical = canonicalizeForInspection(value).toLowerCase();
  return XSS_PATTERNS.some((pattern) => pattern.test(canonical));
}

export function containsPotentialSqlInjection(value: string): boolean {
  const canonical = canonicalizeForInspection(value).toLowerCase();
  return SQLI_PATTERNS.some((pattern) => pattern.test(canonical));
}

export function sanitizeSqlIdentifier(value: unknown): string | null {
  const candidate = sanitizeText(value, {
    required: true,
    maxLength: 64,
    minLength: 1,
  });

  if (!candidate) {
    return null;
  }
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(candidate)) {
    return null;
  }
  return candidate;
}

export function sanitizeSqlParameter(value: unknown): string | null {
  const candidate = sanitizeText(value, {
    required: true,
    maxLength: 512,
    minLength: 1,
  });

  if (!candidate) {
    return null;
  }
  if (containsPotentialSqlInjection(candidate)) {
    return null;
  }
  return candidate;
}

export function coerceToSafeDisplayString(
  value: unknown,
  options: StringSanitizationOptions = {},
): string | null {
  return sanitizeText(value, {
    required: options.required,
    allowEmpty: options.allowEmpty,
    trim: options.trim,
    maxLength: options.maxLength ?? 2000,
    minLength: options.minLength ?? 1,
    escapeHtml: options.escapeHtml ?? false,
  });
}

export function toSafeNonEmptyString(
  value: unknown,
  options: SafeStringOptions = {},
): string | null {
  return coerceToSafeDisplayString(value, {
    required: false,
    allowEmpty: options.allowEmpty ?? false,
    trim: true,
    maxLength: options.maxLength ?? 2000,
    minLength: options.minLength ?? 1,
    escapeHtml: false,
  });
}

export function toSafeStringFromStringOrNumber(
  value: unknown,
  options: SafeStringOptions = {},
): string | null {
  if (validateValueType(value, "number")) {
    const safeNumber = forceToNumber(value);
    return safeNumber === null ? null : String(safeNumber);
  }
  return toSafeNonEmptyString(value, options);
}

export function validateStringValue(
  value: unknown,
  options: StringValidationOptions = {},
): boolean {
  const sanitized = coerceToSafeDisplayString(value, {
    required: true,
    allowEmpty: false,
    trim: true,
    maxLength: options.maxLength ?? 5000,
    minLength: options.minLength ?? 1,
    escapeHtml: false,
  });

  if (!sanitized) {
    return false;
  }
  if (options.pattern && !options.pattern.test(sanitized)) {
    return false;
  }
  if (
    options.rejectThreatPayloads &&
    (containsPotentialXss(sanitized) || containsPotentialSqlInjection(sanitized))
  ) {
    return false;
  }
  return true;
}

export function sanitizeUnknownDeep(
  value: unknown,
  depth = 0,
): unknown {
  if (depth > 6) {
    return null;
  }

  if (validateValueType(value, "string")) {
    return coerceToSafeDisplayString(value);
  }
  if (validateValueType(value, "number")) {
    return forceToNumber(value);
  }
  if (validateValueType(value, "boolean")) {
    return forceToBoolean(value);
  }
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeUnknownDeep(item, depth + 1));
  }
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(
      value as Record<string, unknown>,
    )) {
      const safeKey = sanitizeObjectKey(key, depth);
      output[safeKey] = sanitizeUnknownDeep(nestedValue, depth + 1);
    }
    return output;
  }
  return null;
}

function normalizeInput(value: string): string {
  const normalizedUnicode = value.normalize("NFKC");
  return normalizedUnicode.replace(INVISIBLE_OR_CONTROL_CHARS, "");
}

function canonicalizeForInspection(value: string): string {
  let current = value;

  for (let i = 0; i < 4; i += 1) {
    const next = decodeEscapedUnicode(
      decodeHtmlEntities(decodePercentEncoding(current)),
    );
    if (next === current) {
      break;
    }
    current = next;
  }

  return normalizeInput(current);
}

function decodePercentEncoding(value: string): string {
  if (!value.includes("%")) {
    return value;
  }
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function decodeEscapedUnicode(value: string): string {
  return value
    .replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    );
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#(\d+);?/g, (_, decimal: string) =>
      String.fromCharCode(Number.parseInt(decimal, 10)),
    )
    .replace(/&#x([0-9A-Fa-f]+);?/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/&([A-Za-z]+);/g, (_, named: string) => {
      const replacement = NAMED_ENTITIES[named.toLowerCase()];
      return replacement ?? `&${named};`;
    });
}

function neutralizeDangerousPayload(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\bon\w+\s*=\s*['"][^'"]*['"]/gi, " ")
    .replace(/javascript\s*:/gi, "blocked:")
    .replace(/vbscript\s*:/gi, "blocked:")
    .replace(/data\s*:\s*text\/html/gi, "blocked:data")
    .replace(/(--|#|\/\*|\*\/)/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function escapeHtmlEntities(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeObjectKey(key: string, depth: number): string {
  const normalized = key
    .normalize("NFKC")
    .replace(INVISIBLE_OR_CONTROL_CHARS, "")
    .replace(/[^A-Za-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (normalized.length === 0) {
    return `key_${depth}`;
  }
  return normalized.slice(0, 64);
}
