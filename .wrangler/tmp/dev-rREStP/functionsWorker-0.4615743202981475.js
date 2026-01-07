var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-Xw8rFj/functionsWorker-0.4615743202981475.mjs
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn, res) => /* @__PURE__ */ __name(function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
}, "__init"), "__esm");
var __commonJS = /* @__PURE__ */ __name((cb, mod) => /* @__PURE__ */ __name(function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
}, "__require"), "__commonJS");
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
}, "__export");
var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
}, "__copyProps");
var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
)), "__toESM");
var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
async function onRequestPost({ request, env }) {
  try {
    const { messages, systemPrompt } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const conversationText = messages.map((msg) => `${msg.sender}: ${msg.text}`).join("\n");
    const fullPrompt = systemPrompt ? `${systemPrompt}

Conversation history:
${conversationText}` : conversationText;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ]
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", errorData);
      return new Response(JSON.stringify({
        error: `Gemini API error: ${response.status}`,
        details: errorData
      }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return new Response(JSON.stringify({ error: "Invalid response format from Gemini API" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      text: data.candidates[0].content.parts[0].text
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPost, "onRequestPost");
async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
__name(onRequestOptions, "onRequestOptions");
var init_chat = __esm({
  "api/chat.js"() {
    init_functionsRoutes_0_2592004221498543();
    __name2(onRequestPost, "onRequestPost");
    __name2(onRequestOptions, "onRequestOptions");
  }
});
var browser_exports = {};
__export(browser_exports, {
  Headers: /* @__PURE__ */ __name(() => Headers2, "Headers"),
  Request: /* @__PURE__ */ __name(() => Request2, "Request"),
  Response: /* @__PURE__ */ __name(() => Response2, "Response"),
  default: /* @__PURE__ */ __name(() => browser_default, "default"),
  fetch: /* @__PURE__ */ __name(() => fetch2, "fetch")
});
var getGlobal;
var globalObject;
var fetch2;
var browser_default;
var Headers2;
var Request2;
var Response2;
var init_browser = __esm({
  "../node_modules/@supabase/node-fetch/browser.js"() {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    getGlobal = /* @__PURE__ */ __name2(function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    }, "getGlobal");
    globalObject = getGlobal();
    fetch2 = globalObject.fetch;
    browser_default = globalObject.fetch.bind(globalObject);
    Headers2 = globalObject.Headers;
    Request2 = globalObject.Request;
    Response2 = globalObject.Response;
  }
});
var resolveFetch;
var init_helper = __esm({
  "../node_modules/@supabase/functions-js/dist/module/helper.js"() {
    init_functionsRoutes_0_2592004221498543();
    resolveFetch = /* @__PURE__ */ __name2((customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = /* @__PURE__ */ __name2((...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args)), "_fetch");
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    }, "resolveFetch");
  }
});
var FunctionsError;
var FunctionsFetchError;
var FunctionsRelayError;
var FunctionsHttpError;
var FunctionRegion;
var init_types = __esm({
  "../node_modules/@supabase/functions-js/dist/module/types.js"() {
    init_functionsRoutes_0_2592004221498543();
    FunctionsError = class extends Error {
      static {
        __name(this, "FunctionsError");
      }
      static {
        __name2(this, "FunctionsError");
      }
      constructor(message, name = "FunctionsError", context) {
        super(message);
        this.name = name;
        this.context = context;
      }
    };
    FunctionsFetchError = class extends FunctionsError {
      static {
        __name(this, "FunctionsFetchError");
      }
      static {
        __name2(this, "FunctionsFetchError");
      }
      constructor(context) {
        super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
      }
    };
    FunctionsRelayError = class extends FunctionsError {
      static {
        __name(this, "FunctionsRelayError");
      }
      static {
        __name2(this, "FunctionsRelayError");
      }
      constructor(context) {
        super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
      }
    };
    FunctionsHttpError = class extends FunctionsError {
      static {
        __name(this, "FunctionsHttpError");
      }
      static {
        __name2(this, "FunctionsHttpError");
      }
      constructor(context) {
        super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
      }
    };
    (function(FunctionRegion2) {
      FunctionRegion2["Any"] = "any";
      FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
      FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
      FunctionRegion2["ApSouth1"] = "ap-south-1";
      FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
      FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
      FunctionRegion2["CaCentral1"] = "ca-central-1";
      FunctionRegion2["EuCentral1"] = "eu-central-1";
      FunctionRegion2["EuWest1"] = "eu-west-1";
      FunctionRegion2["EuWest2"] = "eu-west-2";
      FunctionRegion2["EuWest3"] = "eu-west-3";
      FunctionRegion2["SaEast1"] = "sa-east-1";
      FunctionRegion2["UsEast1"] = "us-east-1";
      FunctionRegion2["UsWest1"] = "us-west-1";
      FunctionRegion2["UsWest2"] = "us-west-2";
    })(FunctionRegion || (FunctionRegion = {}));
  }
});
var __awaiter;
var FunctionsClient;
var init_FunctionsClient = __esm({
  "../node_modules/@supabase/functions-js/dist/module/FunctionsClient.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_helper();
    init_types();
    __awaiter = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter");
    FunctionsClient = class {
      static {
        __name(this, "FunctionsClient");
      }
      static {
        __name2(this, "FunctionsClient");
      }
      constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
        this.url = url;
        this.headers = headers;
        this.region = region;
        this.fetch = resolveFetch(customFetch);
      }
      /**
       * Updates the authorization header
       * @param token - the new jwt token sent in the authorisation header
       */
      setAuth(token) {
        this.headers.Authorization = `Bearer ${token}`;
      }
      /**
       * Invokes a function
       * @param functionName - The name of the Function to invoke.
       * @param options - Options for invoking the Function.
       */
      invoke(functionName, options = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const { headers, method, body: functionArgs, signal } = options;
            let _headers = {};
            let { region } = options;
            if (!region) {
              region = this.region;
            }
            const url = new URL(`${this.url}/${functionName}`);
            if (region && region !== "any") {
              _headers["x-region"] = region;
              url.searchParams.set("forceFunctionRegion", region);
            }
            let body;
            if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
              if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
                _headers["Content-Type"] = "application/octet-stream";
                body = functionArgs;
              } else if (typeof functionArgs === "string") {
                _headers["Content-Type"] = "text/plain";
                body = functionArgs;
              } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
                body = functionArgs;
              } else {
                _headers["Content-Type"] = "application/json";
                body = JSON.stringify(functionArgs);
              }
            }
            const response = yield this.fetch(url.toString(), {
              method: method || "POST",
              // headers priority is (high to low):
              // 1. invoke-level headers
              // 2. client-level headers
              // 3. default Content-Type header
              headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
              body,
              signal
            }).catch((fetchError) => {
              if (fetchError.name === "AbortError") {
                throw fetchError;
              }
              throw new FunctionsFetchError(fetchError);
            });
            const isRelayError = response.headers.get("x-relay-error");
            if (isRelayError && isRelayError === "true") {
              throw new FunctionsRelayError(response);
            }
            if (!response.ok) {
              throw new FunctionsHttpError(response);
            }
            let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
            let data;
            if (responseType === "application/json") {
              data = yield response.json();
            } else if (responseType === "application/octet-stream") {
              data = yield response.blob();
            } else if (responseType === "text/event-stream") {
              data = response;
            } else if (responseType === "multipart/form-data") {
              data = yield response.formData();
            } else {
              data = yield response.text();
            }
            return { data, error: null, response };
          } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
              return { data: null, error: new FunctionsFetchError(error) };
            }
            return {
              data: null,
              error,
              response: error instanceof FunctionsHttpError || error instanceof FunctionsRelayError ? error.context : void 0
            };
          }
        });
      }
    };
  }
});
var init_module = __esm({
  "../node_modules/@supabase/functions-js/dist/module/index.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_FunctionsClient();
  }
});
var require_PostgrestError = __commonJS({
  "../node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js"(exports) {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestError2 = class extends Error {
      static {
        __name(this, "PostgrestError2");
      }
      static {
        __name2(this, "PostgrestError");
      }
      constructor(context) {
        super(context.message);
        this.name = "PostgrestError";
        this.details = context.details;
        this.hint = context.hint;
        this.code = context.code;
      }
    };
    exports.default = PostgrestError2;
  }
});
var require_PostgrestBuilder = __commonJS({
  "../node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js"(exports) {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var node_fetch_1 = __importDefault((init_browser(), __toCommonJS(browser_exports)));
    var PostgrestError_1 = __importDefault(require_PostgrestError());
    var PostgrestBuilder2 = class {
      static {
        __name(this, "PostgrestBuilder2");
      }
      static {
        __name2(this, "PostgrestBuilder");
      }
      constructor(builder) {
        var _a, _b;
        this.shouldThrowOnError = false;
        this.method = builder.method;
        this.url = builder.url;
        this.headers = new Headers(builder.headers);
        this.schema = builder.schema;
        this.body = builder.body;
        this.shouldThrowOnError = (_a = builder.shouldThrowOnError) !== null && _a !== void 0 ? _a : false;
        this.signal = builder.signal;
        this.isMaybeSingle = (_b = builder.isMaybeSingle) !== null && _b !== void 0 ? _b : false;
        if (builder.fetch) {
          this.fetch = builder.fetch;
        } else if (typeof fetch === "undefined") {
          this.fetch = node_fetch_1.default;
        } else {
          this.fetch = fetch;
        }
      }
      /**
       * If there's an error with the query, throwOnError will reject the promise by
       * throwing the error instead of returning it as part of a successful response.
       *
       * {@link https://github.com/supabase/supabase-js/issues/92}
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Set an HTTP header for the request.
       */
      setHeader(name, value) {
        this.headers = new Headers(this.headers);
        this.headers.set(name, value);
        return this;
      }
      then(onfulfilled, onrejected) {
        if (this.schema === void 0) {
        } else if (["GET", "HEAD"].includes(this.method)) {
          this.headers.set("Accept-Profile", this.schema);
        } else {
          this.headers.set("Content-Profile", this.schema);
        }
        if (this.method !== "GET" && this.method !== "HEAD") {
          this.headers.set("Content-Type", "application/json");
        }
        const _fetch = this.fetch;
        let res = _fetch(this.url.toString(), {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify(this.body),
          signal: this.signal
        }).then(async (res2) => {
          var _a, _b, _c, _d;
          let error = null;
          let data = null;
          let count = null;
          let status = res2.status;
          let statusText = res2.statusText;
          if (res2.ok) {
            if (this.method !== "HEAD") {
              const body = await res2.text();
              if (body === "") {
              } else if (this.headers.get("Accept") === "text/csv") {
                data = body;
              } else if (this.headers.get("Accept") && ((_a = this.headers.get("Accept")) === null || _a === void 0 ? void 0 : _a.includes("application/vnd.pgrst.plan+text"))) {
                data = body;
              } else {
                data = JSON.parse(body);
              }
            }
            const countHeader = (_b = this.headers.get("Prefer")) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
            const contentRange = (_c = res2.headers.get("content-range")) === null || _c === void 0 ? void 0 : _c.split("/");
            if (countHeader && contentRange && contentRange.length > 1) {
              count = parseInt(contentRange[1]);
            }
            if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
              if (data.length > 1) {
                error = {
                  // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                  code: "PGRST116",
                  details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                  hint: null,
                  message: "JSON object requested, multiple (or no) rows returned"
                };
                data = null;
                count = null;
                status = 406;
                statusText = "Not Acceptable";
              } else if (data.length === 1) {
                data = data[0];
              } else {
                data = null;
              }
            }
          } else {
            const body = await res2.text();
            try {
              error = JSON.parse(body);
              if (Array.isArray(error) && res2.status === 404) {
                data = [];
                error = null;
                status = 200;
                statusText = "OK";
              }
            } catch (_e) {
              if (res2.status === 404 && body === "") {
                status = 204;
                statusText = "No Content";
              } else {
                error = {
                  message: body
                };
              }
            }
            if (error && this.isMaybeSingle && ((_d = error === null || error === void 0 ? void 0 : error.details) === null || _d === void 0 ? void 0 : _d.includes("0 rows"))) {
              error = null;
              status = 200;
              statusText = "OK";
            }
            if (error && this.shouldThrowOnError) {
              throw new PostgrestError_1.default(error);
            }
          }
          const postgrestResponse = {
            error,
            data,
            count,
            status,
            statusText
          };
          return postgrestResponse;
        });
        if (!this.shouldThrowOnError) {
          res = res.catch((fetchError) => {
            var _a, _b, _c;
            return {
              error: {
                message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
                details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ""}`,
                hint: "",
                code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ""}`
              },
              data: null,
              count: null,
              status: 0,
              statusText: ""
            };
          });
        }
        return res.then(onfulfilled, onrejected);
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
      /**
       * Override the type of the returned `data` field in the response.
       *
       * @typeParam NewResult - The new type to cast the response data to
       * @typeParam Options - Optional type configuration (defaults to { merge: true })
       * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
       * @example
       * ```typescript
       * // Merge with existing types (default behavior)
       * const query = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ custom_field: string }>()
       *
       * // Replace existing types completely
       * const replaceQuery = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
       * ```
       * @returns A PostgrestBuilder instance with the new type
       */
      overrideTypes() {
        return this;
      }
    };
    exports.default = PostgrestBuilder2;
  }
});
var require_PostgrestTransformBuilder = __commonJS({
  "../node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js"(exports) {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
    var PostgrestTransformBuilder2 = class extends PostgrestBuilder_1.default {
      static {
        __name(this, "PostgrestTransformBuilder2");
      }
      static {
        __name2(this, "PostgrestTransformBuilder");
      }
      /**
       * Perform a SELECT on the query result.
       *
       * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
       * return modified rows. By calling this method, modified rows are returned in
       * `data`.
       *
       * @param columns - The columns to retrieve, separated by commas
       */
      select(columns) {
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        this.headers.append("Prefer", "return=representation");
        return this;
      }
      /**
       * Order the query result by `column`.
       *
       * You can call this method multiple times to order by multiple columns.
       *
       * You can order referenced tables, but it only affects the ordering of the
       * parent table if you use `!inner` in the query.
       *
       * @param column - The column to order by
       * @param options - Named parameters
       * @param options.ascending - If `true`, the result will be in ascending order
       * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
       * `null`s appear last.
       * @param options.referencedTable - Set this to order a referenced table by
       * its columns
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.order` : "order";
        const existingOrder = this.url.searchParams.get(key);
        this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
        return this;
      }
      /**
       * Limit the query result by `count`.
       *
       * @param count - The maximum number of rows to return
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(key, `${count}`);
        return this;
      }
      /**
       * Limit the query result by starting at an offset `from` and ending at the offset `to`.
       * Only records within this range are returned.
       * This respects the query order and if there is no order clause the range could behave unexpectedly.
       * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
       * and fourth rows of the query.
       *
       * @param from - The starting index from which to limit the result
       * @param to - The last index to which to limit the result
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
        const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
        const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        this.url.searchParams.set(keyLimit, `${to - from + 1}`);
        return this;
      }
      /**
       * Set the AbortSignal for the fetch request.
       *
       * @param signal - The AbortSignal to use for the fetch request
       */
      abortSignal(signal) {
        this.signal = signal;
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be one row (e.g. using `.limit(1)`), otherwise this
       * returns an error.
       */
      single() {
        this.headers.set("Accept", "application/vnd.pgrst.object+json");
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
       * this returns an error.
       */
      maybeSingle() {
        if (this.method === "GET") {
          this.headers.set("Accept", "application/json");
        } else {
          this.headers.set("Accept", "application/vnd.pgrst.object+json");
        }
        this.isMaybeSingle = true;
        return this;
      }
      /**
       * Return `data` as a string in CSV format.
       */
      csv() {
        this.headers.set("Accept", "text/csv");
        return this;
      }
      /**
       * Return `data` as an object in [GeoJSON](https://geojson.org) format.
       */
      geojson() {
        this.headers.set("Accept", "application/geo+json");
        return this;
      }
      /**
       * Return `data` as the EXPLAIN plan for the query.
       *
       * You need to enable the
       * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
       * setting before using this method.
       *
       * @param options - Named parameters
       *
       * @param options.analyze - If `true`, the query will be executed and the
       * actual run time will be returned
       *
       * @param options.verbose - If `true`, the query identifier will be returned
       * and `data` will include the output columns of the query
       *
       * @param options.settings - If `true`, include information on configuration
       * parameters that affect query planning
       *
       * @param options.buffers - If `true`, include information on buffer usage
       *
       * @param options.wal - If `true`, include information on WAL record generation
       *
       * @param options.format - The format of the output, can be `"text"` (default)
       * or `"json"`
       */
      explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
        var _a;
        const options = [
          analyze ? "analyze" : null,
          verbose ? "verbose" : null,
          settings ? "settings" : null,
          buffers ? "buffers" : null,
          wal ? "wal" : null
        ].filter(Boolean).join("|");
        const forMediatype = (_a = this.headers.get("Accept")) !== null && _a !== void 0 ? _a : "application/json";
        this.headers.set("Accept", `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`);
        if (format === "json") {
          return this;
        } else {
          return this;
        }
      }
      /**
       * Rollback the query.
       *
       * `data` will still be returned, but the query is not committed.
       */
      rollback() {
        this.headers.append("Prefer", "tx=rollback");
        return this;
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
      /**
       * Set the maximum number of rows that can be affected by the query.
       * Only available in PostgREST v13+ and only works with PATCH and DELETE methods.
       *
       * @param value - The maximum number of rows that can be affected
       */
      maxAffected(value) {
        this.headers.append("Prefer", "handling=strict");
        this.headers.append("Prefer", `max-affected=${value}`);
        return this;
      }
    };
    exports.default = PostgrestTransformBuilder2;
  }
});
var require_PostgrestFilterBuilder = __commonJS({
  "../node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"(exports) {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
    var PostgrestFilterBuilder2 = class extends PostgrestTransformBuilder_1.default {
      static {
        __name(this, "PostgrestFilterBuilder2");
      }
      static {
        __name2(this, "PostgrestFilterBuilder");
      }
      /**
       * Match only rows where `column` is equal to `value`.
       *
       * To check if the value of `column` is NULL, you should use `.is()` instead.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      eq(column, value) {
        this.url.searchParams.append(column, `eq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is not equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      neq(column, value) {
        this.url.searchParams.append(column, `neq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gt(column, value) {
        this.url.searchParams.append(column, `gt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gte(column, value) {
        this.url.searchParams.append(column, `gte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lt(column, value) {
        this.url.searchParams.append(column, `lt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lte(column, value) {
        this.url.searchParams.append(column, `lte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-sensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      like(column, pattern) {
        this.url.searchParams.append(column, `like.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAllOf(column, patterns) {
        this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-insensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      ilike(column, pattern) {
        this.url.searchParams.append(column, `ilike.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAllOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` IS `value`.
       *
       * For non-boolean columns, this is only relevant for checking if the value of
       * `column` is NULL by setting `value` to `null`.
       *
       * For boolean columns, you can also set `value` to `true` or `false` and it
       * will behave the same way as `.eq()`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      is(column, value) {
        this.url.searchParams.append(column, `is.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is included in the `values` array.
       *
       * @param column - The column to filter on
       * @param values - The values array to filter with
       */
      in(column, values) {
        const cleanedValues = Array.from(new Set(values)).map((s) => {
          if (typeof s === "string" && new RegExp("[,()]").test(s))
            return `"${s}"`;
          else
            return `${s}`;
        }).join(",");
        this.url.searchParams.append(column, `in.(${cleanedValues})`);
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * `column` contains every element appearing in `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      contains(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cs.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * every element appearing in `column` is contained by `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      containedBy(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cd.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is greater than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGt(column, range) {
        this.url.searchParams.append(column, `sr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or greater than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGte(column, range) {
        this.url.searchParams.append(column, `nxl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is less than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLt(column, range) {
        this.url.searchParams.append(column, `sl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or less than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLte(column, range) {
        this.url.searchParams.append(column, `nxr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where `column` is
       * mutually exclusive to `range` and there can be no element between the two
       * ranges.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeAdjacent(column, range) {
        this.url.searchParams.append(column, `adj.${range}`);
        return this;
      }
      /**
       * Only relevant for array and range columns. Match only rows where
       * `column` and `value` have an element in common.
       *
       * @param column - The array or range column to filter on
       * @param value - The array or range value to filter with
       */
      overlaps(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `ov.${value}`);
        } else {
          this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
        }
        return this;
      }
      /**
       * Only relevant for text and tsvector columns. Match only rows where
       * `column` matches the query string in `query`.
       *
       * @param column - The text or tsvector column to filter on
       * @param query - The query text to match with
       * @param options - Named parameters
       * @param options.config - The text search configuration to use
       * @param options.type - Change how the `query` text is interpreted
       */
      textSearch(column, query, { config, type } = {}) {
        let typePart = "";
        if (type === "plain") {
          typePart = "pl";
        } else if (type === "phrase") {
          typePart = "ph";
        } else if (type === "websearch") {
          typePart = "w";
        }
        const configPart = config === void 0 ? "" : `(${config})`;
        this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
        return this;
      }
      /**
       * Match only rows where each column in `query` keys is equal to its
       * associated value. Shorthand for multiple `.eq()`s.
       *
       * @param query - The object to filter with, with column names as keys mapped
       * to their filter values
       */
      match(query) {
        Object.entries(query).forEach(([column, value]) => {
          this.url.searchParams.append(column, `eq.${value}`);
        });
        return this;
      }
      /**
       * Match only rows which doesn't satisfy the filter.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to be negated to filter with, following
       * PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      not(column, operator, value) {
        this.url.searchParams.append(column, `not.${operator}.${value}`);
        return this;
      }
      /**
       * Match only rows which satisfy at least one of the filters.
       *
       * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure it's properly sanitized.
       *
       * It's currently not possible to do an `.or()` filter across multiple tables.
       *
       * @param filters - The filters to use, following PostgREST syntax
       * @param options - Named parameters
       * @param options.referencedTable - Set this to filter on referenced tables
       * instead of the parent table
       * @param options.foreignTable - Deprecated, use `referencedTable` instead
       */
      or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.or` : "or";
        this.url.searchParams.append(key, `(${filters})`);
        return this;
      }
      /**
       * Match only rows which satisfy the filter. This is an escape hatch - you
       * should use the specific filter methods wherever possible.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to filter with, following PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      filter(column, operator, value) {
        this.url.searchParams.append(column, `${operator}.${value}`);
        return this;
      }
    };
    exports.default = PostgrestFilterBuilder2;
  }
});
var require_PostgrestQueryBuilder = __commonJS({
  "../node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js"(exports) {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var PostgrestQueryBuilder2 = class {
      static {
        __name(this, "PostgrestQueryBuilder2");
      }
      static {
        __name2(this, "PostgrestQueryBuilder");
      }
      constructor(url, { headers = {}, schema, fetch: fetch3 }) {
        this.url = url;
        this.headers = new Headers(headers);
        this.schema = schema;
        this.fetch = fetch3;
      }
      /**
       * Perform a SELECT query on the table or view.
       *
       * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
       *
       * @param options - Named parameters
       *
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       *
       * @param options.count - Count algorithm to use to count rows in the table or view.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      select(columns, { head: head2 = false, count } = {}) {
        const method = head2 ? "HEAD" : "GET";
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch
        });
      }
      /**
       * Perform an INSERT into the table or view.
       *
       * By default, inserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to insert. Pass an object to insert a single row
       * or an array to insert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count inserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. Only applies for bulk
       * inserts.
       */
      insert(values, { count, defaultToNull = true } = {}) {
        var _a;
        const method = "POST";
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        if (!defaultToNull) {
          this.headers.append("Prefer", `missing=default`);
        }
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
      /**
       * Perform an UPSERT on the table or view. Depending on the column(s) passed
       * to `onConflict`, `.upsert()` allows you to perform the equivalent of
       * `.insert()` if a row with the corresponding `onConflict` columns doesn't
       * exist, or if it does exist, perform an alternative action depending on
       * `ignoreDuplicates`.
       *
       * By default, upserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to upsert with. Pass an object to upsert a
       * single row or an array to upsert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
       * duplicate rows are determined. Two rows are duplicates if all the
       * `onConflict` columns are equal.
       *
       * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
       * `false`, duplicate rows are merged with existing rows.
       *
       * @param options.count - Count algorithm to use to count upserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. This only applies when
       * inserting new rows, not when merging with existing rows under
       * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
       */
      upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
        var _a;
        const method = "POST";
        this.headers.append("Prefer", `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`);
        if (onConflict !== void 0)
          this.url.searchParams.set("on_conflict", onConflict);
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        if (!defaultToNull) {
          this.headers.append("Prefer", "missing=default");
        }
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
      /**
       * Perform an UPDATE on the table or view.
       *
       * By default, updated rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param values - The values to update with
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count updated rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      update(values, { count } = {}) {
        var _a;
        const method = "PATCH";
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
      /**
       * Perform a DELETE on the table or view.
       *
       * By default, deleted rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count deleted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      delete({ count } = {}) {
        var _a;
        const method = "DELETE";
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
    };
    exports.default = PostgrestQueryBuilder2;
  }
});
var require_PostgrestClient = __commonJS({
  "../node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js"(exports) {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var PostgrestClient2 = class _PostgrestClient {
      static {
        __name(this, "_PostgrestClient");
      }
      static {
        __name2(this, "PostgrestClient");
      }
      // TODO: Add back shouldThrowOnError once we figure out the typings
      /**
       * Creates a PostgREST client.
       *
       * @param url - URL of the PostgREST endpoint
       * @param options - Named parameters
       * @param options.headers - Custom headers
       * @param options.schema - Postgres schema to switch to
       * @param options.fetch - Custom fetch
       */
      constructor(url, { headers = {}, schema, fetch: fetch3 } = {}) {
        this.url = url;
        this.headers = new Headers(headers);
        this.schemaName = schema;
        this.fetch = fetch3;
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        const url = new URL(`${this.url}/${relation}`);
        return new PostgrestQueryBuilder_1.default(url, {
          headers: new Headers(this.headers),
          schema: this.schemaName,
          fetch: this.fetch
        });
      }
      /**
       * Select a schema to query or perform an function (rpc) call.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The schema to query
       */
      schema(schema) {
        return new _PostgrestClient(this.url, {
          headers: this.headers,
          schema,
          fetch: this.fetch
        });
      }
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.get - When set to `true`, the function will be called with
       * read-only access mode.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, { head: head2 = false, get: get2 = false, count } = {}) {
        var _a;
        let method;
        const url = new URL(`${this.url}/rpc/${fn}`);
        let body;
        if (head2 || get2) {
          method = head2 ? "HEAD" : "GET";
          Object.entries(args).filter(([_, value]) => value !== void 0).map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name, value]) => {
            url.searchParams.append(name, value);
          });
        } else {
          method = "POST";
          body = args;
        }
        const headers = new Headers(this.headers);
        if (count) {
          headers.set("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url,
          headers,
          schema: this.schemaName,
          body,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
    };
    exports.default = PostgrestClient2;
  }
});
var require_cjs = __commonJS({
  "../node_modules/@supabase/postgrest-js/dist/cjs/index.js"(exports) {
    "use strict";
    init_functionsRoutes_0_2592004221498543();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostgrestError = exports.PostgrestBuilder = exports.PostgrestTransformBuilder = exports.PostgrestFilterBuilder = exports.PostgrestQueryBuilder = exports.PostgrestClient = void 0;
    var PostgrestClient_1 = __importDefault(require_PostgrestClient());
    exports.PostgrestClient = PostgrestClient_1.default;
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    exports.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    exports.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
    var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
    exports.PostgrestTransformBuilder = PostgrestTransformBuilder_1.default;
    var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
    exports.PostgrestBuilder = PostgrestBuilder_1.default;
    var PostgrestError_1 = __importDefault(require_PostgrestError());
    exports.PostgrestError = PostgrestError_1.default;
    exports.default = {
      PostgrestClient: PostgrestClient_1.default,
      PostgrestQueryBuilder: PostgrestQueryBuilder_1.default,
      PostgrestFilterBuilder: PostgrestFilterBuilder_1.default,
      PostgrestTransformBuilder: PostgrestTransformBuilder_1.default,
      PostgrestBuilder: PostgrestBuilder_1.default,
      PostgrestError: PostgrestError_1.default
    };
  }
});
var import_cjs;
var PostgrestClient;
var PostgrestQueryBuilder;
var PostgrestFilterBuilder;
var PostgrestTransformBuilder;
var PostgrestBuilder;
var PostgrestError;
var init_wrapper = __esm({
  "../node_modules/@supabase/postgrest-js/dist/esm/wrapper.mjs"() {
    init_functionsRoutes_0_2592004221498543();
    import_cjs = __toESM(require_cjs(), 1);
    ({
      PostgrestClient,
      PostgrestQueryBuilder,
      PostgrestFilterBuilder,
      PostgrestTransformBuilder,
      PostgrestBuilder,
      PostgrestError
    } = import_cjs.default);
  }
});
var WebSocketFactory;
var websocket_factory_default;
var init_websocket_factory = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js"() {
    init_functionsRoutes_0_2592004221498543();
    WebSocketFactory = class {
      static {
        __name(this, "WebSocketFactory");
      }
      static {
        __name2(this, "WebSocketFactory");
      }
      static detectEnvironment() {
        var _a;
        if (typeof WebSocket !== "undefined") {
          return { type: "native", constructor: WebSocket };
        }
        if (typeof globalThis !== "undefined" && typeof globalThis.WebSocket !== "undefined") {
          return { type: "native", constructor: globalThis.WebSocket };
        }
        if (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") {
          return { type: "native", constructor: global.WebSocket };
        }
        if (typeof globalThis !== "undefined" && typeof globalThis.WebSocketPair !== "undefined" && typeof globalThis.WebSocket === "undefined") {
          return {
            type: "cloudflare",
            error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
            workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
          };
        }
        if (typeof globalThis !== "undefined" && globalThis.EdgeRuntime || typeof navigator !== "undefined" && ((_a = "Cloudflare-Workers") === null || _a === void 0 ? void 0 : _a.includes("Vercel-Edge"))) {
          return {
            type: "unsupported",
            error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
            workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
          };
        }
        if (typeof process !== "undefined") {
          const processVersions = process["versions"];
          if (processVersions && processVersions["node"]) {
            const versionString = processVersions["node"];
            const nodeVersion = parseInt(versionString.replace(/^v/, "").split(".")[0]);
            if (nodeVersion >= 22) {
              if (typeof globalThis.WebSocket !== "undefined") {
                return { type: "native", constructor: globalThis.WebSocket };
              }
              return {
                type: "unsupported",
                error: `Node.js ${nodeVersion} detected but native WebSocket not found.`,
                workaround: "Provide a WebSocket implementation via the transport option."
              };
            }
            return {
              type: "unsupported",
              error: `Node.js ${nodeVersion} detected without native WebSocket support.`,
              workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })'
            };
          }
        }
        return {
          type: "unsupported",
          error: "Unknown JavaScript runtime without WebSocket support.",
          workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
        };
      }
      static getWebSocketConstructor() {
        const env = this.detectEnvironment();
        if (env.constructor) {
          return env.constructor;
        }
        let errorMessage = env.error || "WebSocket not supported in this environment.";
        if (env.workaround) {
          errorMessage += `

Suggested solution: ${env.workaround}`;
        }
        throw new Error(errorMessage);
      }
      static createWebSocket(url, protocols) {
        const WS = this.getWebSocketConstructor();
        return new WS(url, protocols);
      }
      static isWebSocketSupported() {
        try {
          const env = this.detectEnvironment();
          return env.type === "native" || env.type === "ws";
        } catch (_a) {
          return false;
        }
      }
    };
    websocket_factory_default = WebSocketFactory;
  }
});
var version;
var init_version = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/lib/version.js"() {
    init_functionsRoutes_0_2592004221498543();
    version = "2.15.5";
  }
});
var DEFAULT_VERSION;
var VSN;
var DEFAULT_TIMEOUT;
var WS_CLOSE_NORMAL;
var MAX_PUSH_BUFFER_SIZE;
var SOCKET_STATES;
var CHANNEL_STATES;
var CHANNEL_EVENTS;
var TRANSPORTS;
var CONNECTION_STATE;
var init_constants = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/lib/constants.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_version();
    DEFAULT_VERSION = `realtime-js/${version}`;
    VSN = "1.0.0";
    DEFAULT_TIMEOUT = 1e4;
    WS_CLOSE_NORMAL = 1e3;
    MAX_PUSH_BUFFER_SIZE = 100;
    (function(SOCKET_STATES2) {
      SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
      SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
      SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
      SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
    })(SOCKET_STATES || (SOCKET_STATES = {}));
    (function(CHANNEL_STATES2) {
      CHANNEL_STATES2["closed"] = "closed";
      CHANNEL_STATES2["errored"] = "errored";
      CHANNEL_STATES2["joined"] = "joined";
      CHANNEL_STATES2["joining"] = "joining";
      CHANNEL_STATES2["leaving"] = "leaving";
    })(CHANNEL_STATES || (CHANNEL_STATES = {}));
    (function(CHANNEL_EVENTS2) {
      CHANNEL_EVENTS2["close"] = "phx_close";
      CHANNEL_EVENTS2["error"] = "phx_error";
      CHANNEL_EVENTS2["join"] = "phx_join";
      CHANNEL_EVENTS2["reply"] = "phx_reply";
      CHANNEL_EVENTS2["leave"] = "phx_leave";
      CHANNEL_EVENTS2["access_token"] = "access_token";
    })(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
    (function(TRANSPORTS2) {
      TRANSPORTS2["websocket"] = "websocket";
    })(TRANSPORTS || (TRANSPORTS = {}));
    (function(CONNECTION_STATE2) {
      CONNECTION_STATE2["Connecting"] = "connecting";
      CONNECTION_STATE2["Open"] = "open";
      CONNECTION_STATE2["Closing"] = "closing";
      CONNECTION_STATE2["Closed"] = "closed";
    })(CONNECTION_STATE || (CONNECTION_STATE = {}));
  }
});
var Serializer;
var init_serializer = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/lib/serializer.js"() {
    init_functionsRoutes_0_2592004221498543();
    Serializer = class {
      static {
        __name(this, "Serializer");
      }
      static {
        __name2(this, "Serializer");
      }
      constructor() {
        this.HEADER_LENGTH = 1;
      }
      decode(rawPayload, callback) {
        if (rawPayload.constructor === ArrayBuffer) {
          return callback(this._binaryDecode(rawPayload));
        }
        if (typeof rawPayload === "string") {
          return callback(JSON.parse(rawPayload));
        }
        return callback({});
      }
      _binaryDecode(buffer) {
        const view = new DataView(buffer);
        const decoder = new TextDecoder();
        return this._decodeBroadcast(buffer, view, decoder);
      }
      _decodeBroadcast(buffer, view, decoder) {
        const topicSize = view.getUint8(1);
        const eventSize = view.getUint8(2);
        let offset = this.HEADER_LENGTH + 2;
        const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
        offset = offset + topicSize;
        const event = decoder.decode(buffer.slice(offset, offset + eventSize));
        offset = offset + eventSize;
        const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
        return { ref: null, topic, event, payload: data };
      }
    };
  }
});
var Timer;
var init_timer = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/lib/timer.js"() {
    init_functionsRoutes_0_2592004221498543();
    Timer = class {
      static {
        __name(this, "Timer");
      }
      static {
        __name2(this, "Timer");
      }
      constructor(callback, timerCalc) {
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = void 0;
        this.tries = 0;
        this.callback = callback;
        this.timerCalc = timerCalc;
      }
      reset() {
        this.tries = 0;
        clearTimeout(this.timer);
        this.timer = void 0;
      }
      // Cancels any previous scheduleTimeout and schedules callback
      scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.tries = this.tries + 1;
          this.callback();
        }, this.timerCalc(this.tries + 1));
      }
    };
  }
});
var PostgresTypes;
var convertChangeData;
var convertColumn;
var convertCell;
var noop;
var toBoolean;
var toNumber;
var toJson;
var toArray;
var toTimestampString;
var httpEndpointURL;
var init_transformers = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/lib/transformers.js"() {
    init_functionsRoutes_0_2592004221498543();
    (function(PostgresTypes2) {
      PostgresTypes2["abstime"] = "abstime";
      PostgresTypes2["bool"] = "bool";
      PostgresTypes2["date"] = "date";
      PostgresTypes2["daterange"] = "daterange";
      PostgresTypes2["float4"] = "float4";
      PostgresTypes2["float8"] = "float8";
      PostgresTypes2["int2"] = "int2";
      PostgresTypes2["int4"] = "int4";
      PostgresTypes2["int4range"] = "int4range";
      PostgresTypes2["int8"] = "int8";
      PostgresTypes2["int8range"] = "int8range";
      PostgresTypes2["json"] = "json";
      PostgresTypes2["jsonb"] = "jsonb";
      PostgresTypes2["money"] = "money";
      PostgresTypes2["numeric"] = "numeric";
      PostgresTypes2["oid"] = "oid";
      PostgresTypes2["reltime"] = "reltime";
      PostgresTypes2["text"] = "text";
      PostgresTypes2["time"] = "time";
      PostgresTypes2["timestamp"] = "timestamp";
      PostgresTypes2["timestamptz"] = "timestamptz";
      PostgresTypes2["timetz"] = "timetz";
      PostgresTypes2["tsrange"] = "tsrange";
      PostgresTypes2["tstzrange"] = "tstzrange";
    })(PostgresTypes || (PostgresTypes = {}));
    convertChangeData = /* @__PURE__ */ __name2((columns, record, options = {}) => {
      var _a;
      const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
      return Object.keys(record).reduce((acc, rec_key) => {
        acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
        return acc;
      }, {});
    }, "convertChangeData");
    convertColumn = /* @__PURE__ */ __name2((columnName, columns, record, skipTypes) => {
      const column = columns.find((x) => x.name === columnName);
      const colType = column === null || column === void 0 ? void 0 : column.type;
      const value = record[columnName];
      if (colType && !skipTypes.includes(colType)) {
        return convertCell(colType, value);
      }
      return noop(value);
    }, "convertColumn");
    convertCell = /* @__PURE__ */ __name2((type, value) => {
      if (type.charAt(0) === "_") {
        const dataType = type.slice(1, type.length);
        return toArray(value, dataType);
      }
      switch (type) {
        case PostgresTypes.bool:
          return toBoolean(value);
        case PostgresTypes.float4:
        case PostgresTypes.float8:
        case PostgresTypes.int2:
        case PostgresTypes.int4:
        case PostgresTypes.int8:
        case PostgresTypes.numeric:
        case PostgresTypes.oid:
          return toNumber(value);
        case PostgresTypes.json:
        case PostgresTypes.jsonb:
          return toJson(value);
        case PostgresTypes.timestamp:
          return toTimestampString(value);
        // Format to be consistent with PostgREST
        case PostgresTypes.abstime:
        // To allow users to cast it based on Timezone
        case PostgresTypes.date:
        // To allow users to cast it based on Timezone
        case PostgresTypes.daterange:
        case PostgresTypes.int4range:
        case PostgresTypes.int8range:
        case PostgresTypes.money:
        case PostgresTypes.reltime:
        // To allow users to cast it based on Timezone
        case PostgresTypes.text:
        case PostgresTypes.time:
        // To allow users to cast it based on Timezone
        case PostgresTypes.timestamptz:
        // To allow users to cast it based on Timezone
        case PostgresTypes.timetz:
        // To allow users to cast it based on Timezone
        case PostgresTypes.tsrange:
        case PostgresTypes.tstzrange:
          return noop(value);
        default:
          return noop(value);
      }
    }, "convertCell");
    noop = /* @__PURE__ */ __name2((value) => {
      return value;
    }, "noop");
    toBoolean = /* @__PURE__ */ __name2((value) => {
      switch (value) {
        case "t":
          return true;
        case "f":
          return false;
        default:
          return value;
      }
    }, "toBoolean");
    toNumber = /* @__PURE__ */ __name2((value) => {
      if (typeof value === "string") {
        const parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
          return parsedValue;
        }
      }
      return value;
    }, "toNumber");
    toJson = /* @__PURE__ */ __name2((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.log(`JSON parse error: ${error}`);
          return value;
        }
      }
      return value;
    }, "toJson");
    toArray = /* @__PURE__ */ __name2((value, type) => {
      if (typeof value !== "string") {
        return value;
      }
      const lastIdx = value.length - 1;
      const closeBrace = value[lastIdx];
      const openBrace = value[0];
      if (openBrace === "{" && closeBrace === "}") {
        let arr;
        const valTrim = value.slice(1, lastIdx);
        try {
          arr = JSON.parse("[" + valTrim + "]");
        } catch (_) {
          arr = valTrim ? valTrim.split(",") : [];
        }
        return arr.map((val) => convertCell(type, val));
      }
      return value;
    }, "toArray");
    toTimestampString = /* @__PURE__ */ __name2((value) => {
      if (typeof value === "string") {
        return value.replace(" ", "T");
      }
      return value;
    }, "toTimestampString");
    httpEndpointURL = /* @__PURE__ */ __name2((socketUrl) => {
      let url = socketUrl;
      url = url.replace(/^ws/i, "http");
      url = url.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "");
      return url.replace(/\/+$/, "") + "/api/broadcast";
    }, "httpEndpointURL");
  }
});
var Push;
var init_push = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/lib/push.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_constants();
    Push = class {
      static {
        __name(this, "Push");
      }
      static {
        __name2(this, "Push");
      }
      /**
       * Initializes the Push
       *
       * @param channel The Channel
       * @param event The event, for example `"phx_join"`
       * @param payload The payload, for example `{user_id: 123}`
       * @param timeout The push timeout in milliseconds
       */
      constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
        this.channel = channel;
        this.event = event;
        this.payload = payload;
        this.timeout = timeout;
        this.sent = false;
        this.timeoutTimer = void 0;
        this.ref = "";
        this.receivedResp = null;
        this.recHooks = [];
        this.refEvent = null;
      }
      resend(timeout) {
        this.timeout = timeout;
        this._cancelRefEvent();
        this.ref = "";
        this.refEvent = null;
        this.receivedResp = null;
        this.sent = false;
        this.send();
      }
      send() {
        if (this._hasReceived("timeout")) {
          return;
        }
        this.startTimeout();
        this.sent = true;
        this.channel.socket.push({
          topic: this.channel.topic,
          event: this.event,
          payload: this.payload,
          ref: this.ref,
          join_ref: this.channel._joinRef()
        });
      }
      updatePayload(payload) {
        this.payload = Object.assign(Object.assign({}, this.payload), payload);
      }
      receive(status, callback) {
        var _a;
        if (this._hasReceived(status)) {
          callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
        }
        this.recHooks.push({ status, callback });
        return this;
      }
      startTimeout() {
        if (this.timeoutTimer) {
          return;
        }
        this.ref = this.channel.socket._makeRef();
        this.refEvent = this.channel._replyEventName(this.ref);
        const callback = /* @__PURE__ */ __name2((payload) => {
          this._cancelRefEvent();
          this._cancelTimeout();
          this.receivedResp = payload;
          this._matchReceive(payload);
        }, "callback");
        this.channel._on(this.refEvent, {}, callback);
        this.timeoutTimer = setTimeout(() => {
          this.trigger("timeout", {});
        }, this.timeout);
      }
      trigger(status, response) {
        if (this.refEvent)
          this.channel._trigger(this.refEvent, { status, response });
      }
      destroy() {
        this._cancelRefEvent();
        this._cancelTimeout();
      }
      _cancelRefEvent() {
        if (!this.refEvent) {
          return;
        }
        this.channel._off(this.refEvent, {});
      }
      _cancelTimeout() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = void 0;
      }
      _matchReceive({ status, response }) {
        this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
      }
      _hasReceived(status) {
        return this.receivedResp && this.receivedResp.status === status;
      }
    };
  }
});
var REALTIME_PRESENCE_LISTEN_EVENTS;
var RealtimePresence;
var init_RealtimePresence = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js"() {
    init_functionsRoutes_0_2592004221498543();
    (function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
      REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
      REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
      REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
    })(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
    RealtimePresence = class _RealtimePresence {
      static {
        __name(this, "_RealtimePresence");
      }
      static {
        __name2(this, "RealtimePresence");
      }
      /**
       * Initializes the Presence.
       *
       * @param channel - The RealtimeChannel
       * @param opts - The options,
       *        for example `{events: {state: 'state', diff: 'diff'}}`
       */
      constructor(channel, opts) {
        this.channel = channel;
        this.state = {};
        this.pendingDiffs = [];
        this.joinRef = null;
        this.enabled = false;
        this.caller = {
          onJoin: /* @__PURE__ */ __name2(() => {
          }, "onJoin"),
          onLeave: /* @__PURE__ */ __name2(() => {
          }, "onLeave"),
          onSync: /* @__PURE__ */ __name2(() => {
          }, "onSync")
        };
        const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
          state: "presence_state",
          diff: "presence_diff"
        };
        this.channel._on(events.state, {}, (newState) => {
          const { onJoin, onLeave, onSync } = this.caller;
          this.joinRef = this.channel._joinRef();
          this.state = _RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
          this.pendingDiffs.forEach((diff) => {
            this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
          });
          this.pendingDiffs = [];
          onSync();
        });
        this.channel._on(events.diff, {}, (diff) => {
          const { onJoin, onLeave, onSync } = this.caller;
          if (this.inPendingSyncState()) {
            this.pendingDiffs.push(diff);
          } else {
            this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
            onSync();
          }
        });
        this.onJoin((key, currentPresences, newPresences) => {
          this.channel._trigger("presence", {
            event: "join",
            key,
            currentPresences,
            newPresences
          });
        });
        this.onLeave((key, currentPresences, leftPresences) => {
          this.channel._trigger("presence", {
            event: "leave",
            key,
            currentPresences,
            leftPresences
          });
        });
        this.onSync(() => {
          this.channel._trigger("presence", { event: "sync" });
        });
      }
      /**
       * Used to sync the list of presences on the server with the
       * client's state.
       *
       * An optional `onJoin` and `onLeave` callback can be provided to
       * react to changes in the client's local presences across
       * disconnects and reconnects with the server.
       *
       * @internal
       */
      static syncState(currentState, newState, onJoin, onLeave) {
        const state = this.cloneDeep(currentState);
        const transformedState = this.transformState(newState);
        const joins = {};
        const leaves = {};
        this.map(state, (key, presences) => {
          if (!transformedState[key]) {
            leaves[key] = presences;
          }
        });
        this.map(transformedState, (key, newPresences) => {
          const currentPresences = state[key];
          if (currentPresences) {
            const newPresenceRefs = newPresences.map((m) => m.presence_ref);
            const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
            const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
            const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
            if (joinedPresences.length > 0) {
              joins[key] = joinedPresences;
            }
            if (leftPresences.length > 0) {
              leaves[key] = leftPresences;
            }
          } else {
            joins[key] = newPresences;
          }
        });
        return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
      }
      /**
       * Used to sync a diff of presence join and leave events from the
       * server, as they happen.
       *
       * Like `syncState`, `syncDiff` accepts optional `onJoin` and
       * `onLeave` callbacks to react to a user joining or leaving from a
       * device.
       *
       * @internal
       */
      static syncDiff(state, diff, onJoin, onLeave) {
        const { joins, leaves } = {
          joins: this.transformState(diff.joins),
          leaves: this.transformState(diff.leaves)
        };
        if (!onJoin) {
          onJoin = /* @__PURE__ */ __name2(() => {
          }, "onJoin");
        }
        if (!onLeave) {
          onLeave = /* @__PURE__ */ __name2(() => {
          }, "onLeave");
        }
        this.map(joins, (key, newPresences) => {
          var _a;
          const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
          state[key] = this.cloneDeep(newPresences);
          if (currentPresences.length > 0) {
            const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
            const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
            state[key].unshift(...curPresences);
          }
          onJoin(key, currentPresences, newPresences);
        });
        this.map(leaves, (key, leftPresences) => {
          let currentPresences = state[key];
          if (!currentPresences)
            return;
          const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
          currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
          state[key] = currentPresences;
          onLeave(key, currentPresences, leftPresences);
          if (currentPresences.length === 0)
            delete state[key];
        });
        return state;
      }
      /** @internal */
      static map(obj, func) {
        return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
      }
      /**
       * Remove 'metas' key
       * Change 'phx_ref' to 'presence_ref'
       * Remove 'phx_ref' and 'phx_ref_prev'
       *
       * @example
       * // returns {
       *  abc123: [
       *    { presence_ref: '2', user_id: 1 },
       *    { presence_ref: '3', user_id: 2 }
       *  ]
       * }
       * RealtimePresence.transformState({
       *  abc123: {
       *    metas: [
       *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
       *      { phx_ref: '3', user_id: 2 }
       *    ]
       *  }
       * })
       *
       * @internal
       */
      static transformState(state) {
        state = this.cloneDeep(state);
        return Object.getOwnPropertyNames(state).reduce((newState, key) => {
          const presences = state[key];
          if ("metas" in presences) {
            newState[key] = presences.metas.map((presence) => {
              presence["presence_ref"] = presence["phx_ref"];
              delete presence["phx_ref"];
              delete presence["phx_ref_prev"];
              return presence;
            });
          } else {
            newState[key] = presences;
          }
          return newState;
        }, {});
      }
      /** @internal */
      static cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
      }
      /** @internal */
      onJoin(callback) {
        this.caller.onJoin = callback;
      }
      /** @internal */
      onLeave(callback) {
        this.caller.onLeave = callback;
      }
      /** @internal */
      onSync(callback) {
        this.caller.onSync = callback;
      }
      /** @internal */
      inPendingSyncState() {
        return !this.joinRef || this.joinRef !== this.channel._joinRef();
      }
    };
  }
});
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
var REALTIME_LISTEN_TYPES;
var REALTIME_SUBSCRIBE_STATES;
var RealtimeChannel;
var init_RealtimeChannel = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_constants();
    init_push();
    init_timer();
    init_RealtimePresence();
    init_transformers();
    init_transformers();
    (function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
    })(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
    (function(REALTIME_LISTEN_TYPES2) {
      REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
      REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
      REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
      REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
    })(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
    (function(REALTIME_SUBSCRIBE_STATES2) {
      REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
      REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
      REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
      REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
    })(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
    RealtimeChannel = class _RealtimeChannel {
      static {
        __name(this, "_RealtimeChannel");
      }
      static {
        __name2(this, "RealtimeChannel");
      }
      constructor(topic, params = { config: {} }, socket) {
        this.topic = topic;
        this.params = params;
        this.socket = socket;
        this.bindings = {};
        this.state = CHANNEL_STATES.closed;
        this.joinedOnce = false;
        this.pushBuffer = [];
        this.subTopic = topic.replace(/^realtime:/i, "");
        this.params.config = Object.assign({
          broadcast: { ack: false, self: false },
          presence: { key: "", enabled: false },
          private: false
        }, params.config);
        this.timeout = this.socket.timeout;
        this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
        this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
        this.joinPush.receive("ok", () => {
          this.state = CHANNEL_STATES.joined;
          this.rejoinTimer.reset();
          this.pushBuffer.forEach((pushEvent) => pushEvent.send());
          this.pushBuffer = [];
        });
        this._onClose(() => {
          this.rejoinTimer.reset();
          this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
          this.state = CHANNEL_STATES.closed;
          this.socket._remove(this);
        });
        this._onError((reason) => {
          if (this._isLeaving() || this._isClosed()) {
            return;
          }
          this.socket.log("channel", `error ${this.topic}`, reason);
          this.state = CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive("timeout", () => {
          if (!this._isJoining()) {
            return;
          }
          this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
          this.state = CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive("error", (reason) => {
          if (this._isLeaving() || this._isClosed()) {
            return;
          }
          this.socket.log("channel", `error ${this.topic}`, reason);
          this.state = CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
          this._trigger(this._replyEventName(ref), payload);
        });
        this.presence = new RealtimePresence(this);
        this.broadcastEndpointURL = httpEndpointURL(this.socket.endPoint);
        this.private = this.params.config.private || false;
      }
      /** Subscribe registers your client with the server */
      subscribe(callback, timeout = this.timeout) {
        var _a, _b, _c;
        if (!this.socket.isConnected()) {
          this.socket.connect();
        }
        if (this.state == CHANNEL_STATES.closed) {
          const { config: { broadcast, presence, private: isPrivate } } = this.params;
          const postgres_changes = (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [];
          const presence_enabled = !!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] && this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0 || ((_c = this.params.config.presence) === null || _c === void 0 ? void 0 : _c.enabled) === true;
          const accessTokenPayload = {};
          const config = {
            broadcast,
            presence: Object.assign(Object.assign({}, presence), { enabled: presence_enabled }),
            postgres_changes,
            private: isPrivate
          };
          if (this.socket.accessTokenValue) {
            accessTokenPayload.access_token = this.socket.accessTokenValue;
          }
          this._onError((e) => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e));
          this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
          this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
          this.joinedOnce = true;
          this._rejoin(timeout);
          this.joinPush.receive("ok", async ({ postgres_changes: postgres_changes2 }) => {
            var _a2;
            this.socket.setAuth();
            if (postgres_changes2 === void 0) {
              callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
              return;
            } else {
              const clientPostgresBindings = this.bindings.postgres_changes;
              const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
              const newPostgresBindings = [];
              for (let i = 0; i < bindingsLen; i++) {
                const clientPostgresBinding = clientPostgresBindings[i];
                const { filter: { event, schema, table, filter } } = clientPostgresBinding;
                const serverPostgresFilter = postgres_changes2 && postgres_changes2[i];
                if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
                  newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
                } else {
                  this.unsubscribe();
                  this.state = CHANNEL_STATES.errored;
                  callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
                  return;
                }
              }
              this.bindings.postgres_changes = newPostgresBindings;
              callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
              return;
            }
          }).receive("error", (error) => {
            this.state = CHANNEL_STATES.errored;
            callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(JSON.stringify(Object.values(error).join(", ") || "error")));
            return;
          }).receive("timeout", () => {
            callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
            return;
          });
        }
        return this;
      }
      presenceState() {
        return this.presence.state;
      }
      async track(payload, opts = {}) {
        return await this.send({
          type: "presence",
          event: "track",
          payload
        }, opts.timeout || this.timeout);
      }
      async untrack(opts = {}) {
        return await this.send({
          type: "presence",
          event: "untrack"
        }, opts);
      }
      on(type, filter, callback) {
        if (this.state === CHANNEL_STATES.joined && type === REALTIME_LISTEN_TYPES.PRESENCE) {
          this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`);
          this.unsubscribe().then(() => this.subscribe());
        }
        return this._on(type, filter, callback);
      }
      /**
       * Sends a message into the channel.
       *
       * @param args Arguments to send to channel
       * @param args.type The type of event to send
       * @param args.event The name of the event being sent
       * @param args.payload Payload to be sent
       * @param opts Options to be used during the send process
       */
      async send(args, opts = {}) {
        var _a, _b;
        if (!this._canPush() && args.type === "broadcast") {
          const { event, payload: endpoint_payload } = args;
          const authorization = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
          const options = {
            method: "POST",
            headers: {
              Authorization: authorization,
              apikey: this.socket.apiKey ? this.socket.apiKey : "",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messages: [
                {
                  topic: this.subTopic,
                  event,
                  payload: endpoint_payload,
                  private: this.private
                }
              ]
            })
          };
          try {
            const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
            await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
            return response.ok ? "ok" : "error";
          } catch (error) {
            if (error.name === "AbortError") {
              return "timed out";
            } else {
              return "error";
            }
          }
        } else {
          return new Promise((resolve) => {
            var _a2, _b2, _c;
            const push = this._push(args.type, args, opts.timeout || this.timeout);
            if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
              resolve("ok");
            }
            push.receive("ok", () => resolve("ok"));
            push.receive("error", () => resolve("error"));
            push.receive("timeout", () => resolve("timed out"));
          });
        }
      }
      updateJoinPayload(payload) {
        this.joinPush.updatePayload(payload);
      }
      /**
       * Leaves the channel.
       *
       * Unsubscribes from server events, and instructs channel to terminate on server.
       * Triggers onClose() hooks.
       *
       * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
       * channel.unsubscribe().receive("ok", () => alert("left!") )
       */
      unsubscribe(timeout = this.timeout) {
        this.state = CHANNEL_STATES.leaving;
        const onClose = /* @__PURE__ */ __name2(() => {
          this.socket.log("channel", `leave ${this.topic}`);
          this._trigger(CHANNEL_EVENTS.close, "leave", this._joinRef());
        }, "onClose");
        this.joinPush.destroy();
        let leavePush = null;
        return new Promise((resolve) => {
          leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
          leavePush.receive("ok", () => {
            onClose();
            resolve("ok");
          }).receive("timeout", () => {
            onClose();
            resolve("timed out");
          }).receive("error", () => {
            resolve("error");
          });
          leavePush.send();
          if (!this._canPush()) {
            leavePush.trigger("ok", {});
          }
        }).finally(() => {
          leavePush === null || leavePush === void 0 ? void 0 : leavePush.destroy();
        });
      }
      /**
       * Teardown the channel.
       *
       * Destroys and stops related timers.
       */
      teardown() {
        this.pushBuffer.forEach((push) => push.destroy());
        this.pushBuffer = [];
        this.rejoinTimer.reset();
        this.joinPush.destroy();
        this.state = CHANNEL_STATES.closed;
        this.bindings = {};
      }
      /** @internal */
      async _fetchWithTimeout(url, options, timeout) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
        clearTimeout(id);
        return response;
      }
      /** @internal */
      _push(event, payload, timeout = this.timeout) {
        if (!this.joinedOnce) {
          throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
        }
        let pushEvent = new Push(this, event, payload, timeout);
        if (this._canPush()) {
          pushEvent.send();
        } else {
          this._addToPushBuffer(pushEvent);
        }
        return pushEvent;
      }
      /** @internal */
      _addToPushBuffer(pushEvent) {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
        if (this.pushBuffer.length > MAX_PUSH_BUFFER_SIZE) {
          const removedPush = this.pushBuffer.shift();
          if (removedPush) {
            removedPush.destroy();
            this.socket.log("channel", `discarded push due to buffer overflow: ${removedPush.event}`, removedPush.payload);
          }
        }
      }
      /**
       * Overridable message hook
       *
       * Receives all events for specialized message handling before dispatching to the channel callbacks.
       * Must return the payload, modified or unmodified.
       *
       * @internal
       */
      _onMessage(_event, payload, _ref) {
        return payload;
      }
      /** @internal */
      _isMember(topic) {
        return this.topic === topic;
      }
      /** @internal */
      _joinRef() {
        return this.joinPush.ref;
      }
      /** @internal */
      _trigger(type, payload, ref) {
        var _a, _b;
        const typeLower = type.toLocaleLowerCase();
        const { close, error, leave, join } = CHANNEL_EVENTS;
        const events = [close, error, leave, join];
        if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
          return;
        }
        let handledPayload = this._onMessage(typeLower, payload, ref);
        if (payload && !handledPayload) {
          throw "channel onMessage callbacks must return the payload, modified or unmodified";
        }
        if (["insert", "update", "delete"].includes(typeLower)) {
          (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
            var _a2, _b2, _c;
            return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
          }).map((bind) => bind.callback(handledPayload, ref));
        } else {
          (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
            var _a2, _b2, _c, _d, _e, _f;
            if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
              if ("id" in bind) {
                const bindId = bind.id;
                const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
                return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
              } else {
                const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
                return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
              }
            } else {
              return bind.type.toLocaleLowerCase() === typeLower;
            }
          }).map((bind) => {
            if (typeof handledPayload === "object" && "ids" in handledPayload) {
              const postgresChanges = handledPayload.data;
              const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
              const enrichedPayload = {
                schema,
                table,
                commit_timestamp,
                eventType: type2,
                new: {},
                old: {},
                errors
              };
              handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
            }
            bind.callback(handledPayload, ref);
          });
        }
      }
      /** @internal */
      _isClosed() {
        return this.state === CHANNEL_STATES.closed;
      }
      /** @internal */
      _isJoined() {
        return this.state === CHANNEL_STATES.joined;
      }
      /** @internal */
      _isJoining() {
        return this.state === CHANNEL_STATES.joining;
      }
      /** @internal */
      _isLeaving() {
        return this.state === CHANNEL_STATES.leaving;
      }
      /** @internal */
      _replyEventName(ref) {
        return `chan_reply_${ref}`;
      }
      /** @internal */
      _on(type, filter, callback) {
        const typeLower = type.toLocaleLowerCase();
        const binding = {
          type: typeLower,
          filter,
          callback
        };
        if (this.bindings[typeLower]) {
          this.bindings[typeLower].push(binding);
        } else {
          this.bindings[typeLower] = [binding];
        }
        return this;
      }
      /** @internal */
      _off(type, filter) {
        const typeLower = type.toLocaleLowerCase();
        if (this.bindings[typeLower]) {
          this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
            var _a;
            return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && _RealtimeChannel.isEqual(bind.filter, filter));
          });
        }
        return this;
      }
      /** @internal */
      static isEqual(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
          return false;
        }
        for (const k in obj1) {
          if (obj1[k] !== obj2[k]) {
            return false;
          }
        }
        return true;
      }
      /** @internal */
      _rejoinUntilConnected() {
        this.rejoinTimer.scheduleTimeout();
        if (this.socket.isConnected()) {
          this._rejoin();
        }
      }
      /**
       * Registers a callback that will be executed when the channel closes.
       *
       * @internal
       */
      _onClose(callback) {
        this._on(CHANNEL_EVENTS.close, {}, callback);
      }
      /**
       * Registers a callback that will be executed when the channel encounteres an error.
       *
       * @internal
       */
      _onError(callback) {
        this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
      }
      /**
       * Returns `true` if the socket is connected and the channel has been joined.
       *
       * @internal
       */
      _canPush() {
        return this.socket.isConnected() && this._isJoined();
      }
      /** @internal */
      _rejoin(timeout = this.timeout) {
        if (this._isLeaving()) {
          return;
        }
        this.socket._leaveOpenTopic(this.topic);
        this.state = CHANNEL_STATES.joining;
        this.joinPush.resend(timeout);
      }
      /** @internal */
      _getPayloadRecords(payload) {
        const records = {
          new: {},
          old: {}
        };
        if (payload.type === "INSERT" || payload.type === "UPDATE") {
          records.new = convertChangeData(payload.columns, payload.record);
        }
        if (payload.type === "UPDATE" || payload.type === "DELETE") {
          records.old = convertChangeData(payload.columns, payload.old_record);
        }
        return records;
      }
    };
  }
});
var noop2;
var CONNECTION_TIMEOUTS;
var RECONNECT_INTERVALS;
var DEFAULT_RECONNECT_FALLBACK;
var WORKER_SCRIPT;
var RealtimeClient;
var init_RealtimeClient = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_websocket_factory();
    init_constants();
    init_serializer();
    init_timer();
    init_transformers();
    init_RealtimeChannel();
    noop2 = /* @__PURE__ */ __name2(() => {
    }, "noop");
    CONNECTION_TIMEOUTS = {
      HEARTBEAT_INTERVAL: 25e3,
      RECONNECT_DELAY: 10,
      HEARTBEAT_TIMEOUT_FALLBACK: 100
    };
    RECONNECT_INTERVALS = [1e3, 2e3, 5e3, 1e4];
    DEFAULT_RECONNECT_FALLBACK = 1e4;
    WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
    RealtimeClient = class {
      static {
        __name(this, "RealtimeClient");
      }
      static {
        __name2(this, "RealtimeClient");
      }
      /**
       * Initializes the Socket.
       *
       * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
       * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
       * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
       * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
       * @param options.params The optional params to pass when connecting.
       * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
       * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
       * @param options.heartbeatCallback The optional function to handle heartbeat status.
       * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
       * @param options.logLevel Sets the log level for Realtime
       * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
       * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
       * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
       * @param options.worker Use Web Worker to set a side flow. Defaults to false.
       * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
       */
      constructor(endPoint, options) {
        var _a;
        this.accessTokenValue = null;
        this.apiKey = null;
        this.channels = new Array();
        this.endPoint = "";
        this.httpEndpoint = "";
        this.headers = {};
        this.params = {};
        this.timeout = DEFAULT_TIMEOUT;
        this.transport = null;
        this.heartbeatIntervalMs = CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
        this.heartbeatTimer = void 0;
        this.pendingHeartbeatRef = null;
        this.heartbeatCallback = noop2;
        this.ref = 0;
        this.reconnectTimer = null;
        this.logger = noop2;
        this.conn = null;
        this.sendBuffer = [];
        this.serializer = new Serializer();
        this.stateChangeCallbacks = {
          open: [],
          close: [],
          error: [],
          message: []
        };
        this.accessToken = null;
        this._connectionState = "disconnected";
        this._wasManualDisconnect = false;
        this._authPromise = null;
        this._resolveFetch = (customFetch) => {
          let _fetch;
          if (customFetch) {
            _fetch = customFetch;
          } else if (typeof fetch === "undefined") {
            _fetch = /* @__PURE__ */ __name2((...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args)).catch((error) => {
              throw new Error(`Failed to load @supabase/node-fetch: ${error.message}. This is required for HTTP requests in Node.js environments without native fetch.`);
            }), "_fetch");
          } else {
            _fetch = fetch;
          }
          return (...args) => _fetch(...args);
        };
        if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) {
          throw new Error("API key is required to connect to Realtime");
        }
        this.apiKey = options.params.apikey;
        this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
        this.httpEndpoint = httpEndpointURL(endPoint);
        this._initializeOptions(options);
        this._setupReconnectionTimer();
        this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
      }
      /**
       * Connects the socket, unless already connected.
       */
      connect() {
        if (this.isConnecting() || this.isDisconnecting() || this.conn !== null && this.isConnected()) {
          return;
        }
        this._setConnectionState("connecting");
        this._setAuthSafely("connect");
        if (this.transport) {
          this.conn = new this.transport(this.endpointURL());
        } else {
          try {
            this.conn = websocket_factory_default.createWebSocket(this.endpointURL());
          } catch (error) {
            this._setConnectionState("disconnected");
            const errorMessage = error.message;
            if (errorMessage.includes("Node.js")) {
              throw new Error(`${errorMessage}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
            }
            throw new Error(`WebSocket not available: ${errorMessage}`);
          }
        }
        this._setupConnectionHandlers();
      }
      /**
       * Returns the URL of the websocket.
       * @returns string The URL of the websocket.
       */
      endpointURL() {
        return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
      }
      /**
       * Disconnects the socket.
       *
       * @param code A numeric status code to send on disconnect.
       * @param reason A custom reason for the disconnect.
       */
      disconnect(code, reason) {
        if (this.isDisconnecting()) {
          return;
        }
        this._setConnectionState("disconnecting", true);
        if (this.conn) {
          const fallbackTimer = setTimeout(() => {
            this._setConnectionState("disconnected");
          }, 100);
          this.conn.onclose = () => {
            clearTimeout(fallbackTimer);
            this._setConnectionState("disconnected");
          };
          if (code) {
            this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
          } else {
            this.conn.close();
          }
          this._teardownConnection();
        } else {
          this._setConnectionState("disconnected");
        }
      }
      /**
       * Returns all created channels
       */
      getChannels() {
        return this.channels;
      }
      /**
       * Unsubscribes and removes a single channel
       * @param channel A RealtimeChannel instance
       */
      async removeChannel(channel) {
        const status = await channel.unsubscribe();
        if (this.channels.length === 0) {
          this.disconnect();
        }
        return status;
      }
      /**
       * Unsubscribes and removes all channels
       */
      async removeAllChannels() {
        const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
        this.channels = [];
        this.disconnect();
        return values_1;
      }
      /**
       * Logs the message.
       *
       * For customized logging, `this.logger` can be overridden.
       */
      log(kind, msg, data) {
        this.logger(kind, msg, data);
      }
      /**
       * Returns the current state of the socket.
       */
      connectionState() {
        switch (this.conn && this.conn.readyState) {
          case SOCKET_STATES.connecting:
            return CONNECTION_STATE.Connecting;
          case SOCKET_STATES.open:
            return CONNECTION_STATE.Open;
          case SOCKET_STATES.closing:
            return CONNECTION_STATE.Closing;
          default:
            return CONNECTION_STATE.Closed;
        }
      }
      /**
       * Returns `true` is the connection is open.
       */
      isConnected() {
        return this.connectionState() === CONNECTION_STATE.Open;
      }
      /**
       * Returns `true` if the connection is currently connecting.
       */
      isConnecting() {
        return this._connectionState === "connecting";
      }
      /**
       * Returns `true` if the connection is currently disconnecting.
       */
      isDisconnecting() {
        return this._connectionState === "disconnecting";
      }
      channel(topic, params = { config: {} }) {
        const realtimeTopic = `realtime:${topic}`;
        const exists = this.getChannels().find((c) => c.topic === realtimeTopic);
        if (!exists) {
          const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
          this.channels.push(chan);
          return chan;
        } else {
          return exists;
        }
      }
      /**
       * Push out a message if the socket is connected.
       *
       * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
       */
      push(data) {
        const { topic, event, payload, ref } = data;
        const callback = /* @__PURE__ */ __name2(() => {
          this.encode(data, (result) => {
            var _a;
            (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
          });
        }, "callback");
        this.log("push", `${topic} ${event} (${ref})`, payload);
        if (this.isConnected()) {
          callback();
        } else {
          this.sendBuffer.push(callback);
        }
      }
      /**
       * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
       *
       * If param is null it will use the `accessToken` callback function or the token set on the client.
       *
       * On callback used, it will set the value of the token internal to the client.
       *
       * @param token A JWT string to override the token set on the client.
       */
      async setAuth(token = null) {
        this._authPromise = this._performAuth(token);
        try {
          await this._authPromise;
        } finally {
          this._authPromise = null;
        }
      }
      /**
       * Sends a heartbeat message if the socket is connected.
       */
      async sendHeartbeat() {
        var _a;
        if (!this.isConnected()) {
          try {
            this.heartbeatCallback("disconnected");
          } catch (e) {
            this.log("error", "error in heartbeat callback", e);
          }
          return;
        }
        if (this.pendingHeartbeatRef) {
          this.pendingHeartbeatRef = null;
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
          try {
            this.heartbeatCallback("timeout");
          } catch (e) {
            this.log("error", "error in heartbeat callback", e);
          }
          this._wasManualDisconnect = false;
          (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "heartbeat timeout");
          setTimeout(() => {
            var _a2;
            if (!this.isConnected()) {
              (_a2 = this.reconnectTimer) === null || _a2 === void 0 ? void 0 : _a2.scheduleTimeout();
            }
          }, CONNECTION_TIMEOUTS.HEARTBEAT_TIMEOUT_FALLBACK);
          return;
        }
        this.pendingHeartbeatRef = this._makeRef();
        this.push({
          topic: "phoenix",
          event: "heartbeat",
          payload: {},
          ref: this.pendingHeartbeatRef
        });
        try {
          this.heartbeatCallback("sent");
        } catch (e) {
          this.log("error", "error in heartbeat callback", e);
        }
        this._setAuthSafely("heartbeat");
      }
      onHeartbeat(callback) {
        this.heartbeatCallback = callback;
      }
      /**
       * Flushes send buffer
       */
      flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
          this.sendBuffer.forEach((callback) => callback());
          this.sendBuffer = [];
        }
      }
      /**
       * Return the next message ref, accounting for overflows
       *
       * @internal
       */
      _makeRef() {
        let newRef = this.ref + 1;
        if (newRef === this.ref) {
          this.ref = 0;
        } else {
          this.ref = newRef;
        }
        return this.ref.toString();
      }
      /**
       * Unsubscribe from channels with the specified topic.
       *
       * @internal
       */
      _leaveOpenTopic(topic) {
        let dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()));
        if (dupChannel) {
          this.log("transport", `leaving duplicate topic "${topic}"`);
          dupChannel.unsubscribe();
        }
      }
      /**
       * Removes a subscription from the socket.
       *
       * @param channel An open subscription.
       *
       * @internal
       */
      _remove(channel) {
        this.channels = this.channels.filter((c) => c.topic !== channel.topic);
      }
      /** @internal */
      _onConnMessage(rawMessage) {
        this.decode(rawMessage.data, (msg) => {
          if (msg.topic === "phoenix" && msg.event === "phx_reply") {
            try {
              this.heartbeatCallback(msg.payload.status === "ok" ? "ok" : "error");
            } catch (e) {
              this.log("error", "error in heartbeat callback", e);
            }
          }
          if (msg.ref && msg.ref === this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
          }
          const { topic, event, payload, ref } = msg;
          const refString = ref ? `(${ref})` : "";
          const status = payload.status || "";
          this.log("receive", `${status} ${topic} ${event} ${refString}`.trim(), payload);
          this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
          this._triggerStateCallbacks("message", msg);
        });
      }
      /**
       * Clear specific timer
       * @internal
       */
      _clearTimer(timer) {
        var _a;
        if (timer === "heartbeat" && this.heartbeatTimer) {
          clearInterval(this.heartbeatTimer);
          this.heartbeatTimer = void 0;
        } else if (timer === "reconnect") {
          (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.reset();
        }
      }
      /**
       * Clear all timers
       * @internal
       */
      _clearAllTimers() {
        this._clearTimer("heartbeat");
        this._clearTimer("reconnect");
      }
      /**
       * Setup connection handlers for WebSocket events
       * @internal
       */
      _setupConnectionHandlers() {
        if (!this.conn)
          return;
        if ("binaryType" in this.conn) {
          ;
          this.conn.binaryType = "arraybuffer";
        }
        this.conn.onopen = () => this._onConnOpen();
        this.conn.onerror = (error) => this._onConnError(error);
        this.conn.onmessage = (event) => this._onConnMessage(event);
        this.conn.onclose = (event) => this._onConnClose(event);
      }
      /**
       * Teardown connection and cleanup resources
       * @internal
       */
      _teardownConnection() {
        if (this.conn) {
          this.conn.onopen = null;
          this.conn.onerror = null;
          this.conn.onmessage = null;
          this.conn.onclose = null;
          this.conn = null;
        }
        this._clearAllTimers();
        this.channels.forEach((channel) => channel.teardown());
      }
      /** @internal */
      _onConnOpen() {
        this._setConnectionState("connected");
        this.log("transport", `connected to ${this.endpointURL()}`);
        this.flushSendBuffer();
        this._clearTimer("reconnect");
        if (!this.worker) {
          this._startHeartbeat();
        } else {
          if (!this.workerRef) {
            this._startWorkerHeartbeat();
          }
        }
        this._triggerStateCallbacks("open");
      }
      /** @internal */
      _startHeartbeat() {
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
      }
      /** @internal */
      _startWorkerHeartbeat() {
        if (this.workerUrl) {
          this.log("worker", `starting worker for from ${this.workerUrl}`);
        } else {
          this.log("worker", `starting default worker`);
        }
        const objectUrl = this._workerObjectUrl(this.workerUrl);
        this.workerRef = new Worker(objectUrl);
        this.workerRef.onerror = (error) => {
          this.log("worker", "worker error", error.message);
          this.workerRef.terminate();
        };
        this.workerRef.onmessage = (event) => {
          if (event.data.event === "keepAlive") {
            this.sendHeartbeat();
          }
        };
        this.workerRef.postMessage({
          event: "start",
          interval: this.heartbeatIntervalMs
        });
      }
      /** @internal */
      _onConnClose(event) {
        var _a;
        this._setConnectionState("disconnected");
        this.log("transport", "close", event);
        this._triggerChanError();
        this._clearTimer("heartbeat");
        if (!this._wasManualDisconnect) {
          (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.scheduleTimeout();
        }
        this._triggerStateCallbacks("close", event);
      }
      /** @internal */
      _onConnError(error) {
        this._setConnectionState("disconnected");
        this.log("transport", `${error}`);
        this._triggerChanError();
        this._triggerStateCallbacks("error", error);
      }
      /** @internal */
      _triggerChanError() {
        this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error));
      }
      /** @internal */
      _appendParams(url, params) {
        if (Object.keys(params).length === 0) {
          return url;
        }
        const prefix = url.match(/\?/) ? "&" : "?";
        const query = new URLSearchParams(params);
        return `${url}${prefix}${query}`;
      }
      _workerObjectUrl(url) {
        let result_url;
        if (url) {
          result_url = url;
        } else {
          const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
          result_url = URL.createObjectURL(blob);
        }
        return result_url;
      }
      /**
       * Set connection state with proper state management
       * @internal
       */
      _setConnectionState(state, manual = false) {
        this._connectionState = state;
        if (state === "connecting") {
          this._wasManualDisconnect = false;
        } else if (state === "disconnecting") {
          this._wasManualDisconnect = manual;
        }
      }
      /**
       * Perform the actual auth operation
       * @internal
       */
      async _performAuth(token = null) {
        let tokenToSend;
        if (token) {
          tokenToSend = token;
        } else if (this.accessToken) {
          tokenToSend = await this.accessToken();
        } else {
          tokenToSend = this.accessTokenValue;
        }
        if (this.accessTokenValue != tokenToSend) {
          this.accessTokenValue = tokenToSend;
          this.channels.forEach((channel) => {
            const payload = {
              access_token: tokenToSend,
              version: DEFAULT_VERSION
            };
            tokenToSend && channel.updateJoinPayload(payload);
            if (channel.joinedOnce && channel._isJoined()) {
              channel._push(CHANNEL_EVENTS.access_token, {
                access_token: tokenToSend
              });
            }
          });
        }
      }
      /**
       * Wait for any in-flight auth operations to complete
       * @internal
       */
      async _waitForAuthIfNeeded() {
        if (this._authPromise) {
          await this._authPromise;
        }
      }
      /**
       * Safely call setAuth with standardized error handling
       * @internal
       */
      _setAuthSafely(context = "general") {
        this.setAuth().catch((e) => {
          this.log("error", `error setting auth in ${context}`, e);
        });
      }
      /**
       * Trigger state change callbacks with proper error handling
       * @internal
       */
      _triggerStateCallbacks(event, data) {
        try {
          this.stateChangeCallbacks[event].forEach((callback) => {
            try {
              callback(data);
            } catch (e) {
              this.log("error", `error in ${event} callback`, e);
            }
          });
        } catch (e) {
          this.log("error", `error triggering ${event} callbacks`, e);
        }
      }
      /**
       * Setup reconnection timer with proper configuration
       * @internal
       */
      _setupReconnectionTimer() {
        this.reconnectTimer = new Timer(async () => {
          setTimeout(async () => {
            await this._waitForAuthIfNeeded();
            if (!this.isConnected()) {
              this.connect();
            }
          }, CONNECTION_TIMEOUTS.RECONNECT_DELAY);
        }, this.reconnectAfterMs);
      }
      /**
       * Initialize client options with defaults
       * @internal
       */
      _initializeOptions(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.transport = (_a = options === null || options === void 0 ? void 0 : options.transport) !== null && _a !== void 0 ? _a : null;
        this.timeout = (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : DEFAULT_TIMEOUT;
        this.heartbeatIntervalMs = (_c = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _c !== void 0 ? _c : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
        this.worker = (_d = options === null || options === void 0 ? void 0 : options.worker) !== null && _d !== void 0 ? _d : false;
        this.accessToken = (_e = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _e !== void 0 ? _e : null;
        this.heartbeatCallback = (_f = options === null || options === void 0 ? void 0 : options.heartbeatCallback) !== null && _f !== void 0 ? _f : noop2;
        if (options === null || options === void 0 ? void 0 : options.params)
          this.params = options.params;
        if (options === null || options === void 0 ? void 0 : options.logger)
          this.logger = options.logger;
        if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
          this.logLevel = options.logLevel || options.log_level;
          this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel });
        }
        this.reconnectAfterMs = (_g = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _g !== void 0 ? _g : (tries) => {
          return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
        };
        this.encode = (_h = options === null || options === void 0 ? void 0 : options.encode) !== null && _h !== void 0 ? _h : (payload, callback) => {
          return callback(JSON.stringify(payload));
        };
        this.decode = (_j = options === null || options === void 0 ? void 0 : options.decode) !== null && _j !== void 0 ? _j : this.serializer.decode.bind(this.serializer);
        if (this.worker) {
          if (typeof window !== "undefined" && !window.Worker) {
            throw new Error("Web Worker is not supported");
          }
          this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
        }
      }
    };
  }
});
var init_module2 = __esm({
  "../node_modules/@supabase/realtime-js/dist/module/index.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_RealtimeClient();
    init_RealtimeChannel();
    init_RealtimePresence();
    init_websocket_factory();
  }
});
function isStorageError(error) {
  return typeof error === "object" && error !== null && "__isStorageError" in error;
}
__name(isStorageError, "isStorageError");
var StorageError;
var StorageApiError;
var StorageUnknownError;
var init_errors = __esm({
  "../node_modules/@supabase/storage-js/dist/module/lib/errors.js"() {
    init_functionsRoutes_0_2592004221498543();
    StorageError = class extends Error {
      static {
        __name(this, "StorageError");
      }
      static {
        __name2(this, "StorageError");
      }
      constructor(message) {
        super(message);
        this.__isStorageError = true;
        this.name = "StorageError";
      }
    };
    __name2(isStorageError, "isStorageError");
    StorageApiError = class extends StorageError {
      static {
        __name(this, "StorageApiError");
      }
      static {
        __name2(this, "StorageApiError");
      }
      constructor(message, status, statusCode) {
        super(message);
        this.name = "StorageApiError";
        this.status = status;
        this.statusCode = statusCode;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          statusCode: this.statusCode
        };
      }
    };
    StorageUnknownError = class extends StorageError {
      static {
        __name(this, "StorageUnknownError");
      }
      static {
        __name2(this, "StorageUnknownError");
      }
      constructor(message, originalError) {
        super(message);
        this.name = "StorageUnknownError";
        this.originalError = originalError;
      }
    };
  }
});
var __awaiter2;
var resolveFetch2;
var resolveResponse;
var recursiveToCamel;
var isPlainObject;
var init_helpers = __esm({
  "../node_modules/@supabase/storage-js/dist/module/lib/helpers.js"() {
    init_functionsRoutes_0_2592004221498543();
    __awaiter2 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter2");
    resolveFetch2 = /* @__PURE__ */ __name2((customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = /* @__PURE__ */ __name2((...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args)), "_fetch");
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    }, "resolveFetch");
    resolveResponse = /* @__PURE__ */ __name2(() => __awaiter2(void 0, void 0, void 0, function* () {
      if (typeof Response === "undefined") {
        return (yield Promise.resolve().then(() => (init_browser(), browser_exports))).Response;
      }
      return Response;
    }), "resolveResponse");
    recursiveToCamel = /* @__PURE__ */ __name2((item) => {
      if (Array.isArray(item)) {
        return item.map((el) => recursiveToCamel(el));
      } else if (typeof item === "function" || item !== Object(item)) {
        return item;
      }
      const result = {};
      Object.entries(item).forEach(([key, value]) => {
        const newKey = key.replace(/([-_][a-z])/gi, (c) => c.toUpperCase().replace(/[-_]/g, ""));
        result[newKey] = recursiveToCamel(value);
      });
      return result;
    }, "recursiveToCamel");
    isPlainObject = /* @__PURE__ */ __name2((value) => {
      if (typeof value !== "object" || value === null) {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
    }, "isPlainObject");
  }
});
function _handleRequest(fetcher, method, url, options, parameters, body) {
  return __awaiter3(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
        if (!result.ok)
          throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson)
          return result;
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options));
    });
  });
}
__name(_handleRequest, "_handleRequest");
function get(fetcher, url, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "GET", url, options, parameters);
  });
}
__name(get, "get");
function post(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "POST", url, options, parameters, body);
  });
}
__name(post, "post");
function put(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "PUT", url, options, parameters, body);
  });
}
__name(put, "put");
function head(fetcher, url, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "HEAD", url, Object.assign(Object.assign({}, options), { noResolveJson: true }), parameters);
  });
}
__name(head, "head");
function remove(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "DELETE", url, options, parameters, body);
  });
}
__name(remove, "remove");
var __awaiter3;
var _getErrorMessage;
var handleError;
var _getRequestParams;
var init_fetch = __esm({
  "../node_modules/@supabase/storage-js/dist/module/lib/fetch.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_errors();
    init_helpers();
    __awaiter3 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter3");
    _getErrorMessage = /* @__PURE__ */ __name2((err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err), "_getErrorMessage");
    handleError = /* @__PURE__ */ __name2((error, reject, options) => __awaiter3(void 0, void 0, void 0, function* () {
      const Res = yield resolveResponse();
      if (error instanceof Res && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
        error.json().then((err) => {
          const status = error.status || 500;
          const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || status + "";
          reject(new StorageApiError(_getErrorMessage(err), status, statusCode));
        }).catch((err) => {
          reject(new StorageUnknownError(_getErrorMessage(err), err));
        });
      } else {
        reject(new StorageUnknownError(_getErrorMessage(error), error));
      }
    }), "handleError");
    _getRequestParams = /* @__PURE__ */ __name2((method, options, parameters, body) => {
      const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
      if (method === "GET" || !body) {
        return params;
      }
      if (isPlainObject(body)) {
        params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
      } else {
        params.body = body;
      }
      if (options === null || options === void 0 ? void 0 : options.duplex) {
        params.duplex = options.duplex;
      }
      return Object.assign(Object.assign({}, params), parameters);
    }, "_getRequestParams");
    __name2(_handleRequest, "_handleRequest");
    __name2(get, "get");
    __name2(post, "post");
    __name2(put, "put");
    __name2(head, "head");
    __name2(remove, "remove");
  }
});
var __awaiter4;
var StreamDownloadBuilder;
var init_StreamDownloadBuilder = __esm({
  "../node_modules/@supabase/storage-js/dist/module/packages/StreamDownloadBuilder.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_errors();
    __awaiter4 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter4");
    StreamDownloadBuilder = class {
      static {
        __name(this, "StreamDownloadBuilder");
      }
      static {
        __name2(this, "StreamDownloadBuilder");
      }
      constructor(downloadFn, shouldThrowOnError) {
        this.downloadFn = downloadFn;
        this.shouldThrowOnError = shouldThrowOnError;
      }
      then(onfulfilled, onrejected) {
        return this.execute().then(onfulfilled, onrejected);
      }
      execute() {
        return __awaiter4(this, void 0, void 0, function* () {
          try {
            const result = yield this.downloadFn();
            return {
              data: result.body,
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
  }
});
var __awaiter5;
var BlobDownloadBuilder;
var init_BlobDownloadBuilder = __esm({
  "../node_modules/@supabase/storage-js/dist/module/packages/BlobDownloadBuilder.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_errors();
    init_StreamDownloadBuilder();
    __awaiter5 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter5");
    BlobDownloadBuilder = class {
      static {
        __name(this, "BlobDownloadBuilder");
      }
      static {
        __name2(this, "BlobDownloadBuilder");
      }
      constructor(downloadFn, shouldThrowOnError) {
        this.downloadFn = downloadFn;
        this.shouldThrowOnError = shouldThrowOnError;
      }
      asStream() {
        return new StreamDownloadBuilder(this.downloadFn, this.shouldThrowOnError);
      }
      then(onfulfilled, onrejected) {
        return this.execute().then(onfulfilled, onrejected);
      }
      execute() {
        return __awaiter5(this, void 0, void 0, function* () {
          try {
            const result = yield this.downloadFn();
            return {
              data: yield result.blob(),
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
  }
});
var __awaiter6;
var DEFAULT_SEARCH_OPTIONS;
var DEFAULT_FILE_OPTIONS;
var StorageFileApi;
var init_StorageFileApi = __esm({
  "../node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_errors();
    init_fetch();
    init_helpers();
    init_BlobDownloadBuilder();
    __awaiter6 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter6");
    DEFAULT_SEARCH_OPTIONS = {
      limit: 100,
      offset: 0,
      sortBy: {
        column: "name",
        order: "asc"
      }
    };
    DEFAULT_FILE_OPTIONS = {
      cacheControl: "3600",
      contentType: "text/plain;charset=UTF-8",
      upsert: false
    };
    StorageFileApi = class {
      static {
        __name(this, "StorageFileApi");
      }
      static {
        __name2(this, "StorageFileApi");
      }
      constructor(url, headers = {}, bucketId, fetch3) {
        this.shouldThrowOnError = false;
        this.url = url;
        this.headers = headers;
        this.bucketId = bucketId;
        this.fetch = resolveFetch2(fetch3);
      }
      /**
       * Enable throwing errors instead of returning them.
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
       *
       * @param method HTTP method.
       * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param fileBody The body of the file to be stored in the bucket.
       */
      uploadOrUpdate(method, path, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            let body;
            const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
            let headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
            const metadata = options.metadata;
            if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
              body = new FormData();
              body.append("cacheControl", options.cacheControl);
              if (metadata) {
                body.append("metadata", this.encodeMetadata(metadata));
              }
              body.append("", fileBody);
            } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
              body = fileBody;
              body.append("cacheControl", options.cacheControl);
              if (metadata) {
                body.append("metadata", this.encodeMetadata(metadata));
              }
            } else {
              body = fileBody;
              headers["cache-control"] = `max-age=${options.cacheControl}`;
              headers["content-type"] = options.contentType;
              if (metadata) {
                headers["x-metadata"] = this.toBase64(this.encodeMetadata(metadata));
              }
            }
            if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) {
              headers = Object.assign(Object.assign({}, headers), fileOptions.headers);
            }
            const cleanPath = this._removeEmptyFolders(path);
            const _path = this._getFinalPath(cleanPath);
            const data = yield (method == "PUT" ? put : post)(this.fetch, `${this.url}/object/${_path}`, body, Object.assign({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
            return {
              data: { path: cleanPath, id: data.Id, fullPath: data.Key },
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Uploads a file to an existing bucket.
       *
       * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param fileBody The body of the file to be stored in the bucket.
       */
      upload(path, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
        });
      }
      /**
       * Upload a file with a token generated from `createSignedUploadUrl`.
       * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param token The token generated from `createSignedUploadUrl`
       * @param fileBody The body of the file to be stored in the bucket.
       */
      uploadToSignedUrl(path, token, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          const cleanPath = this._removeEmptyFolders(path);
          const _path = this._getFinalPath(cleanPath);
          const url = new URL(this.url + `/object/upload/sign/${_path}`);
          url.searchParams.set("token", token);
          try {
            let body;
            const options = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
            const headers = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(options.upsert) });
            if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
              body = new FormData();
              body.append("cacheControl", options.cacheControl);
              body.append("", fileBody);
            } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
              body = fileBody;
              body.append("cacheControl", options.cacheControl);
            } else {
              body = fileBody;
              headers["cache-control"] = `max-age=${options.cacheControl}`;
              headers["content-type"] = options.contentType;
            }
            const data = yield put(this.fetch, url.toString(), body, { headers });
            return {
              data: { path: cleanPath, fullPath: data.Key },
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates a signed upload URL.
       * Signed upload URLs can be used to upload files to the bucket without further authentication.
       * They are valid for 2 hours.
       * @param path The file path, including the current file name. For example `folder/image.png`.
       * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
       */
      createSignedUploadUrl(path, options) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            let _path = this._getFinalPath(path);
            const headers = Object.assign({}, this.headers);
            if (options === null || options === void 0 ? void 0 : options.upsert) {
              headers["x-upsert"] = "true";
            }
            const data = yield post(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers });
            const url = new URL(this.url + data.url);
            const token = url.searchParams.get("token");
            if (!token) {
              throw new StorageError("No token returned by API");
            }
            return { data: { signedUrl: url.toString(), path, token }, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Replaces an existing file at the specified path with a new one.
       *
       * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
       * @param fileBody The body of the file to be stored in the bucket.
       */
      update(path, fileBody, fileOptions) {
        return __awaiter6(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
        });
      }
      /**
       * Moves an existing file to a new path in the same bucket.
       *
       * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
       * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
       * @param options The destination options.
       */
      move(fromPath, toPath, options) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/object/move`, {
              bucketId: this.bucketId,
              sourceKey: fromPath,
              destinationKey: toPath,
              destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Copies an existing file to a new path in the same bucket.
       *
       * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
       * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
       * @param options The destination options.
       */
      copy(fromPath, toPath, options) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/object/copy`, {
              bucketId: this.bucketId,
              sourceKey: fromPath,
              destinationKey: toPath,
              destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
            }, { headers: this.headers });
            return { data: { path: data.Key }, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
       *
       * @param path The file path, including the current file name. For example `folder/image.png`.
       * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
       * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       * @param options.transform Transform the asset before serving it to the client.
       */
      createSignedUrl(path, expiresIn, options) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            let _path = this._getFinalPath(path);
            let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: this.headers });
            const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
            const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
            data = { signedUrl };
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
       *
       * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
       * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
       * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       */
      createSignedUrls(paths, expiresIn, options) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
            const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
            return {
              data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
       *
       * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
       * @param options.transform Transform the asset before serving it to the client.
       */
      download(path, options) {
        const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
        const renderPath = wantsTransformation ? "render/image/authenticated" : "object";
        const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
        const queryString = transformationQuery ? `?${transformationQuery}` : "";
        const _path = this._getFinalPath(path);
        const downloadFn = /* @__PURE__ */ __name2(() => get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        }), "downloadFn");
        return new BlobDownloadBuilder(downloadFn, this.shouldThrowOnError);
      }
      /**
       * Retrieves the details of an existing file.
       * @param path
       */
      info(path) {
        return __awaiter6(this, void 0, void 0, function* () {
          const _path = this._getFinalPath(path);
          try {
            const data = yield get(this.fetch, `${this.url}/object/info/${_path}`, {
              headers: this.headers
            });
            return { data: recursiveToCamel(data), error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Checks the existence of a file.
       * @param path
       */
      exists(path) {
        return __awaiter6(this, void 0, void 0, function* () {
          const _path = this._getFinalPath(path);
          try {
            yield head(this.fetch, `${this.url}/object/${_path}`, {
              headers: this.headers
            });
            return { data: true, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error) && error instanceof StorageUnknownError) {
              const originalError = error.originalError;
              if ([400, 404].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) {
                return { data: false, error };
              }
            }
            throw error;
          }
        });
      }
      /**
       * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
       * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
       *
       * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
       * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       * @param options.transform Transform the asset before serving it to the client.
       */
      getPublicUrl(path, options) {
        const _path = this._getFinalPath(path);
        const _queryString = [];
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? "" : options.download}` : "";
        if (downloadQueryParam !== "") {
          _queryString.push(downloadQueryParam);
        }
        const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
        const renderPath = wantsTransformation ? "render/image" : "object";
        const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
        if (transformationQuery !== "") {
          _queryString.push(transformationQuery);
        }
        let queryString = _queryString.join("&");
        if (queryString !== "") {
          queryString = `?${queryString}`;
        }
        return {
          data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
        };
      }
      /**
       * Deletes files within the same bucket
       *
       * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
       */
      remove(paths) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Get file metadata
       * @param id the file id to retrieve metadata
       */
      // async getMetadata(
      //   id: string
      // ): Promise<
      //   | {
      //       data: Metadata
      //       error: null
      //     }
      //   | {
      //       data: null
      //       error: StorageError
      //     }
      // > {
      //   try {
      //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
      //     return { data, error: null }
      //   } catch (error) {
      //     if (isStorageError(error)) {
      //       return { data: null, error }
      //     }
      //     throw error
      //   }
      // }
      /**
       * Update file metadata
       * @param id the file id to update metadata
       * @param meta the new file metadata
       */
      // async updateMetadata(
      //   id: string,
      //   meta: Metadata
      // ): Promise<
      //   | {
      //       data: Metadata
      //       error: null
      //     }
      //   | {
      //       data: null
      //       error: StorageError
      //     }
      // > {
      //   try {
      //     const data = await post(
      //       this.fetch,
      //       `${this.url}/metadata/${id}`,
      //       { ...meta },
      //       { headers: this.headers }
      //     )
      //     return { data, error: null }
      //   } catch (error) {
      //     if (isStorageError(error)) {
      //       return { data: null, error }
      //     }
      //     throw error
      //   }
      // }
      /**
       * Lists all the files and folders within a path of the bucket.
       * @param path The folder path.
       * @param options Search options including limit (defaults to 100), offset, sortBy, and search
       */
      list(path, options, parameters) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || "" });
            const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * @experimental this method signature might change in the future
       * @param options search options
       * @param parameters
       */
      listV2(options, parameters) {
        return __awaiter6(this, void 0, void 0, function* () {
          try {
            const body = Object.assign({}, options);
            const data = yield post(this.fetch, `${this.url}/object/list-v2/${this.bucketId}`, body, { headers: this.headers }, parameters);
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      encodeMetadata(metadata) {
        return JSON.stringify(metadata);
      }
      toBase64(data) {
        if (typeof Buffer !== "undefined") {
          return Buffer.from(data).toString("base64");
        }
        return btoa(data);
      }
      _getFinalPath(path) {
        return `${this.bucketId}/${path.replace(/^\/+/, "")}`;
      }
      _removeEmptyFolders(path) {
        return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
      }
      transformOptsToQueryString(transform) {
        const params = [];
        if (transform.width) {
          params.push(`width=${transform.width}`);
        }
        if (transform.height) {
          params.push(`height=${transform.height}`);
        }
        if (transform.resize) {
          params.push(`resize=${transform.resize}`);
        }
        if (transform.format) {
          params.push(`format=${transform.format}`);
        }
        if (transform.quality) {
          params.push(`quality=${transform.quality}`);
        }
        return params.join("&");
      }
    };
  }
});
var version2;
var init_version2 = __esm({
  "../node_modules/@supabase/storage-js/dist/module/lib/version.js"() {
    init_functionsRoutes_0_2592004221498543();
    version2 = "2.12.2";
  }
});
var DEFAULT_HEADERS;
var init_constants2 = __esm({
  "../node_modules/@supabase/storage-js/dist/module/lib/constants.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_version2();
    DEFAULT_HEADERS = { "X-Client-Info": `storage-js/${version2}` };
  }
});
var __awaiter7;
var StorageBucketApi;
var init_StorageBucketApi = __esm({
  "../node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_constants2();
    init_errors();
    init_fetch();
    init_helpers();
    __awaiter7 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter7");
    StorageBucketApi = class {
      static {
        __name(this, "StorageBucketApi");
      }
      static {
        __name2(this, "StorageBucketApi");
      }
      constructor(url, headers = {}, fetch3, opts) {
        this.shouldThrowOnError = false;
        const baseUrl = new URL(url);
        if (opts === null || opts === void 0 ? void 0 : opts.useNewHostname) {
          const isSupabaseHost = /supabase\.(co|in|red)$/.test(baseUrl.hostname);
          if (isSupabaseHost && !baseUrl.hostname.includes("storage.supabase.")) {
            baseUrl.hostname = baseUrl.hostname.replace("supabase.", "storage.supabase.");
          }
        }
        this.url = baseUrl.href;
        this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS), headers);
        this.fetch = resolveFetch2(fetch3);
      }
      /**
       * Enable throwing errors instead of returning them.
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Retrieves the details of all Storage buckets within an existing project.
       */
      listBuckets() {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Retrieves the details of an existing Storage bucket.
       *
       * @param id The unique identifier of the bucket you would like to retrieve.
       */
      getBucket(id) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates a new Storage bucket
       *
       * @param id A unique identifier for the bucket you are creating.
       * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
       * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
       * The global file size limit takes precedence over this value.
       * The default value is null, which doesn't set a per bucket file size limit.
       * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
       * The default value is null, which allows files with all mime types to be uploaded.
       * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
       * @returns newly created bucket id
       * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
       *   - default bucket type is `STANDARD`
       */
      createBucket(id, options = {
        public: false
      }) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/bucket`, {
              id,
              name: id,
              type: options.type,
              public: options.public,
              file_size_limit: options.fileSizeLimit,
              allowed_mime_types: options.allowedMimeTypes
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Updates a Storage bucket
       *
       * @param id A unique identifier for the bucket you are updating.
       * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
       * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
       * The global file size limit takes precedence over this value.
       * The default value is null, which doesn't set a per bucket file size limit.
       * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
       * The default value is null, which allows files with all mime types to be uploaded.
       * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
       */
      updateBucket(id, options) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield put(this.fetch, `${this.url}/bucket/${id}`, {
              id,
              name: id,
              public: options.public,
              file_size_limit: options.fileSizeLimit,
              allowed_mime_types: options.allowedMimeTypes
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Removes all objects inside a single bucket.
       *
       * @param id The unique identifier of the bucket you would like to empty.
       */
      emptyBucket(id) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
       * You must first `empty()` the bucket.
       *
       * @param id The unique identifier of the bucket you would like to delete.
       */
      deleteBucket(id) {
        return __awaiter7(this, void 0, void 0, function* () {
          try {
            const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if (isStorageError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
  }
});
var StorageClient;
var init_StorageClient = __esm({
  "../node_modules/@supabase/storage-js/dist/module/StorageClient.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_StorageFileApi();
    init_StorageBucketApi();
    StorageClient = class extends StorageBucketApi {
      static {
        __name(this, "StorageClient");
      }
      static {
        __name2(this, "StorageClient");
      }
      constructor(url, headers = {}, fetch3, opts) {
        super(url, headers, fetch3, opts);
      }
      /**
       * Perform file operation in a bucket.
       *
       * @param id The bucket id to operate on.
       */
      from(id) {
        return new StorageFileApi(this.url, this.headers, id, this.fetch);
      }
    };
  }
});
var init_types2 = __esm({
  "../node_modules/@supabase/storage-js/dist/module/lib/types.js"() {
    init_functionsRoutes_0_2592004221498543();
  }
});
var init_module3 = __esm({
  "../node_modules/@supabase/storage-js/dist/module/index.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_StorageClient();
    init_types2();
    init_errors();
  }
});
var version3;
var init_version3 = __esm({
  "../node_modules/@supabase/supabase-js/dist/module/lib/version.js"() {
    init_functionsRoutes_0_2592004221498543();
    version3 = "2.58.0";
  }
});
var JS_ENV;
var DEFAULT_HEADERS2;
var DEFAULT_GLOBAL_OPTIONS;
var DEFAULT_DB_OPTIONS;
var DEFAULT_AUTH_OPTIONS;
var DEFAULT_REALTIME_OPTIONS;
var init_constants3 = __esm({
  "../node_modules/@supabase/supabase-js/dist/module/lib/constants.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_version3();
    JS_ENV = "";
    if (typeof Deno !== "undefined") {
      JS_ENV = "deno";
    } else if (typeof document !== "undefined") {
      JS_ENV = "web";
    } else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
      JS_ENV = "react-native";
    } else {
      JS_ENV = "node";
    }
    DEFAULT_HEADERS2 = { "X-Client-Info": `supabase-js-${JS_ENV}/${version3}` };
    DEFAULT_GLOBAL_OPTIONS = {
      headers: DEFAULT_HEADERS2
    };
    DEFAULT_DB_OPTIONS = {
      schema: "public"
    };
    DEFAULT_AUTH_OPTIONS = {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "implicit"
    };
    DEFAULT_REALTIME_OPTIONS = {};
  }
});
var __awaiter8;
var resolveFetch3;
var resolveHeadersConstructor;
var fetchWithAuth;
var init_fetch2 = __esm({
  "../node_modules/@supabase/supabase-js/dist/module/lib/fetch.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_browser();
    __awaiter8 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter8");
    resolveFetch3 = /* @__PURE__ */ __name2((customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = browser_default;
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    }, "resolveFetch");
    resolveHeadersConstructor = /* @__PURE__ */ __name2(() => {
      if (typeof Headers === "undefined") {
        return Headers2;
      }
      return Headers;
    }, "resolveHeadersConstructor");
    fetchWithAuth = /* @__PURE__ */ __name2((supabaseKey, getAccessToken, customFetch) => {
      const fetch3 = resolveFetch3(customFetch);
      const HeadersConstructor = resolveHeadersConstructor();
      return (input, init) => __awaiter8(void 0, void 0, void 0, function* () {
        var _a;
        const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
        let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
        if (!headers.has("apikey")) {
          headers.set("apikey", supabaseKey);
        }
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return fetch3(input, Object.assign(Object.assign({}, init), { headers }));
      });
    }, "fetchWithAuth");
  }
});
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
__name(ensureTrailingSlash, "ensureTrailingSlash");
function applySettingDefaults(options, defaults) {
  var _a, _b;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  const result = {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    storage: {},
    global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS2 === null || DEFAULT_GLOBAL_OPTIONS2 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS2.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
    accessToken: /* @__PURE__ */ __name2(() => __awaiter9(this, void 0, void 0, function* () {
      return "";
    }), "accessToken")
  };
  if (options.accessToken) {
    result.accessToken = options.accessToken;
  } else {
    delete result.accessToken;
  }
  return result;
}
__name(applySettingDefaults, "applySettingDefaults");
function validateSupabaseUrl(supabaseUrl) {
  const trimmedUrl = supabaseUrl === null || supabaseUrl === void 0 ? void 0 : supabaseUrl.trim();
  if (!trimmedUrl) {
    throw new Error("supabaseUrl is required.");
  }
  if (!trimmedUrl.match(/^https?:\/\//i)) {
    throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
  }
  try {
    return new URL(ensureTrailingSlash(trimmedUrl));
  } catch (_a) {
    throw Error("Invalid supabaseUrl: Provided URL is malformed.");
  }
}
__name(validateSupabaseUrl, "validateSupabaseUrl");
var __awaiter9;
var init_helpers2 = __esm({
  "../node_modules/@supabase/supabase-js/dist/module/lib/helpers.js"() {
    init_functionsRoutes_0_2592004221498543();
    __awaiter9 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter9");
    __name2(ensureTrailingSlash, "ensureTrailingSlash");
    __name2(applySettingDefaults, "applySettingDefaults");
    __name2(validateSupabaseUrl, "validateSupabaseUrl");
  }
});
var version4;
var init_version4 = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/version.js"() {
    init_functionsRoutes_0_2592004221498543();
    version4 = "2.72.0";
  }
});
var AUTO_REFRESH_TICK_DURATION_MS;
var AUTO_REFRESH_TICK_THRESHOLD;
var EXPIRY_MARGIN_MS;
var GOTRUE_URL;
var STORAGE_KEY;
var DEFAULT_HEADERS3;
var API_VERSION_HEADER_NAME;
var API_VERSIONS;
var BASE64URL_REGEX;
var JWKS_TTL;
var init_constants4 = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/constants.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_version4();
    AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
    AUTO_REFRESH_TICK_THRESHOLD = 3;
    EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
    GOTRUE_URL = "http://localhost:9999";
    STORAGE_KEY = "supabase.auth.token";
    DEFAULT_HEADERS3 = { "X-Client-Info": `gotrue-js/${version4}` };
    API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
    API_VERSIONS = {
      "2024-01-01": {
        timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
        name: "2024-01-01"
      }
    };
    BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
    JWKS_TTL = 10 * 60 * 1e3;
  }
});
function isAuthError(error) {
  return typeof error === "object" && error !== null && "__isAuthError" in error;
}
__name(isAuthError, "isAuthError");
function isAuthApiError(error) {
  return isAuthError(error) && error.name === "AuthApiError";
}
__name(isAuthApiError, "isAuthApiError");
function isAuthSessionMissingError(error) {
  return isAuthError(error) && error.name === "AuthSessionMissingError";
}
__name(isAuthSessionMissingError, "isAuthSessionMissingError");
function isAuthImplicitGrantRedirectError(error) {
  return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
}
__name(isAuthImplicitGrantRedirectError, "isAuthImplicitGrantRedirectError");
function isAuthRetryableFetchError(error) {
  return isAuthError(error) && error.name === "AuthRetryableFetchError";
}
__name(isAuthRetryableFetchError, "isAuthRetryableFetchError");
var AuthError;
var AuthApiError;
var AuthUnknownError;
var CustomAuthError;
var AuthSessionMissingError;
var AuthInvalidTokenResponseError;
var AuthInvalidCredentialsError;
var AuthImplicitGrantRedirectError;
var AuthPKCEGrantCodeExchangeError;
var AuthRetryableFetchError;
var AuthWeakPasswordError;
var AuthInvalidJwtError;
var init_errors2 = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/errors.js"() {
    init_functionsRoutes_0_2592004221498543();
    AuthError = class extends Error {
      static {
        __name(this, "AuthError");
      }
      static {
        __name2(this, "AuthError");
      }
      constructor(message, status, code) {
        super(message);
        this.__isAuthError = true;
        this.name = "AuthError";
        this.status = status;
        this.code = code;
      }
    };
    __name2(isAuthError, "isAuthError");
    AuthApiError = class extends AuthError {
      static {
        __name(this, "AuthApiError");
      }
      static {
        __name2(this, "AuthApiError");
      }
      constructor(message, status, code) {
        super(message, status, code);
        this.name = "AuthApiError";
        this.status = status;
        this.code = code;
      }
    };
    __name2(isAuthApiError, "isAuthApiError");
    AuthUnknownError = class extends AuthError {
      static {
        __name(this, "AuthUnknownError");
      }
      static {
        __name2(this, "AuthUnknownError");
      }
      constructor(message, originalError) {
        super(message);
        this.name = "AuthUnknownError";
        this.originalError = originalError;
      }
    };
    CustomAuthError = class extends AuthError {
      static {
        __name(this, "CustomAuthError");
      }
      static {
        __name2(this, "CustomAuthError");
      }
      constructor(message, name, status, code) {
        super(message, status, code);
        this.name = name;
        this.status = status;
      }
    };
    AuthSessionMissingError = class extends CustomAuthError {
      static {
        __name(this, "AuthSessionMissingError");
      }
      static {
        __name2(this, "AuthSessionMissingError");
      }
      constructor() {
        super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
      }
    };
    __name2(isAuthSessionMissingError, "isAuthSessionMissingError");
    AuthInvalidTokenResponseError = class extends CustomAuthError {
      static {
        __name(this, "AuthInvalidTokenResponseError");
      }
      static {
        __name2(this, "AuthInvalidTokenResponseError");
      }
      constructor() {
        super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
      }
    };
    AuthInvalidCredentialsError = class extends CustomAuthError {
      static {
        __name(this, "AuthInvalidCredentialsError");
      }
      static {
        __name2(this, "AuthInvalidCredentialsError");
      }
      constructor(message) {
        super(message, "AuthInvalidCredentialsError", 400, void 0);
      }
    };
    AuthImplicitGrantRedirectError = class extends CustomAuthError {
      static {
        __name(this, "AuthImplicitGrantRedirectError");
      }
      static {
        __name2(this, "AuthImplicitGrantRedirectError");
      }
      constructor(message, details = null) {
        super(message, "AuthImplicitGrantRedirectError", 500, void 0);
        this.details = null;
        this.details = details;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          details: this.details
        };
      }
    };
    __name2(isAuthImplicitGrantRedirectError, "isAuthImplicitGrantRedirectError");
    AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
      static {
        __name(this, "AuthPKCEGrantCodeExchangeError");
      }
      static {
        __name2(this, "AuthPKCEGrantCodeExchangeError");
      }
      constructor(message, details = null) {
        super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
        this.details = null;
        this.details = details;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          details: this.details
        };
      }
    };
    AuthRetryableFetchError = class extends CustomAuthError {
      static {
        __name(this, "AuthRetryableFetchError");
      }
      static {
        __name2(this, "AuthRetryableFetchError");
      }
      constructor(message, status) {
        super(message, "AuthRetryableFetchError", status, void 0);
      }
    };
    __name2(isAuthRetryableFetchError, "isAuthRetryableFetchError");
    AuthWeakPasswordError = class extends CustomAuthError {
      static {
        __name(this, "AuthWeakPasswordError");
      }
      static {
        __name2(this, "AuthWeakPasswordError");
      }
      constructor(message, status, reasons2) {
        super(message, "AuthWeakPasswordError", status, "weak_password");
        this.reasons = reasons2;
      }
    };
    AuthInvalidJwtError = class extends CustomAuthError {
      static {
        __name(this, "AuthInvalidJwtError");
      }
      static {
        __name2(this, "AuthInvalidJwtError");
      }
      constructor(message) {
        super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
      }
    };
  }
});
function byteToBase64URL(byte, state, emit) {
  if (byte !== null) {
    state.queue = state.queue << 8 | byte;
    state.queuedBits += 8;
    while (state.queuedBits >= 6) {
      const pos = state.queue >> state.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state.queuedBits -= 6;
    }
  } else if (state.queuedBits > 0) {
    state.queue = state.queue << 6 - state.queuedBits;
    state.queuedBits = 6;
    while (state.queuedBits >= 6) {
      const pos = state.queue >> state.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state.queuedBits -= 6;
    }
  }
}
__name(byteToBase64URL, "byteToBase64URL");
function byteFromBase64URL(charCode, state, emit) {
  const bits = FROM_BASE64URL[charCode];
  if (bits > -1) {
    state.queue = state.queue << 6 | bits;
    state.queuedBits += 6;
    while (state.queuedBits >= 8) {
      emit(state.queue >> state.queuedBits - 8 & 255);
      state.queuedBits -= 8;
    }
  } else if (bits === -2) {
    return;
  } else {
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
  }
}
__name(byteFromBase64URL, "byteFromBase64URL");
function stringFromBase64URL(str) {
  const conv = [];
  const utf8Emit = /* @__PURE__ */ __name2((codepoint) => {
    conv.push(String.fromCodePoint(codepoint));
  }, "utf8Emit");
  const utf8State = {
    utf8seq: 0,
    codepoint: 0
  };
  const b64State = { queue: 0, queuedBits: 0 };
  const byteEmit = /* @__PURE__ */ __name2((byte) => {
    stringFromUTF8(byte, utf8State, utf8Emit);
  }, "byteEmit");
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), b64State, byteEmit);
  }
  return conv.join("");
}
__name(stringFromBase64URL, "stringFromBase64URL");
function codepointToUTF8(codepoint, emit) {
  if (codepoint <= 127) {
    emit(codepoint);
    return;
  } else if (codepoint <= 2047) {
    emit(192 | codepoint >> 6);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 65535) {
    emit(224 | codepoint >> 12);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 1114111) {
    emit(240 | codepoint >> 18);
    emit(128 | codepoint >> 12 & 63);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  }
  throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
}
__name(codepointToUTF8, "codepointToUTF8");
function stringToUTF8(str, emit) {
  for (let i = 0; i < str.length; i += 1) {
    let codepoint = str.charCodeAt(i);
    if (codepoint > 55295 && codepoint <= 56319) {
      const highSurrogate = (codepoint - 55296) * 1024 & 65535;
      const lowSurrogate = str.charCodeAt(i + 1) - 56320 & 65535;
      codepoint = (lowSurrogate | highSurrogate) + 65536;
      i += 1;
    }
    codepointToUTF8(codepoint, emit);
  }
}
__name(stringToUTF8, "stringToUTF8");
function stringFromUTF8(byte, state, emit) {
  if (state.utf8seq === 0) {
    if (byte <= 127) {
      emit(byte);
      return;
    }
    for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
      if ((byte >> 7 - leadingBit & 1) === 0) {
        state.utf8seq = leadingBit;
        break;
      }
    }
    if (state.utf8seq === 2) {
      state.codepoint = byte & 31;
    } else if (state.utf8seq === 3) {
      state.codepoint = byte & 15;
    } else if (state.utf8seq === 4) {
      state.codepoint = byte & 7;
    } else {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.utf8seq -= 1;
  } else if (state.utf8seq > 0) {
    if (byte <= 127) {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.codepoint = state.codepoint << 6 | byte & 63;
    state.utf8seq -= 1;
    if (state.utf8seq === 0) {
      emit(state.codepoint);
    }
  }
}
__name(stringFromUTF8, "stringFromUTF8");
function base64UrlToUint8Array(str) {
  const result = [];
  const state = { queue: 0, queuedBits: 0 };
  const onByte = /* @__PURE__ */ __name2((byte) => {
    result.push(byte);
  }, "onByte");
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), state, onByte);
  }
  return new Uint8Array(result);
}
__name(base64UrlToUint8Array, "base64UrlToUint8Array");
function stringToUint8Array(str) {
  const result = [];
  stringToUTF8(str, (byte) => result.push(byte));
  return new Uint8Array(result);
}
__name(stringToUint8Array, "stringToUint8Array");
function bytesToBase64URL(bytes) {
  const result = [];
  const state = { queue: 0, queuedBits: 0 };
  const onChar = /* @__PURE__ */ __name2((char) => {
    result.push(char);
  }, "onChar");
  bytes.forEach((byte) => byteToBase64URL(byte, state, onChar));
  byteToBase64URL(null, state, onChar);
  return result.join("");
}
__name(bytesToBase64URL, "bytesToBase64URL");
var TO_BASE64URL;
var IGNORE_BASE64URL;
var FROM_BASE64URL;
var init_base64url = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/base64url.js"() {
    init_functionsRoutes_0_2592004221498543();
    TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
    IGNORE_BASE64URL = " 	\n\r=".split("");
    FROM_BASE64URL = (() => {
      const charMap = new Array(128);
      for (let i = 0; i < charMap.length; i += 1) {
        charMap[i] = -1;
      }
      for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
        charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
      }
      for (let i = 0; i < TO_BASE64URL.length; i += 1) {
        charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
      }
      return charMap;
    })();
    __name2(byteToBase64URL, "byteToBase64URL");
    __name2(byteFromBase64URL, "byteFromBase64URL");
    __name2(stringFromBase64URL, "stringFromBase64URL");
    __name2(codepointToUTF8, "codepointToUTF8");
    __name2(stringToUTF8, "stringToUTF8");
    __name2(stringFromUTF8, "stringFromUTF8");
    __name2(base64UrlToUint8Array, "base64UrlToUint8Array");
    __name2(stringToUint8Array, "stringToUint8Array");
    __name2(bytesToBase64URL, "bytesToBase64URL");
  }
});
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3);
  return timeNow + expiresIn;
}
__name(expiresAt, "expiresAt");
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
__name(uuid, "uuid");
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key) => {
        result[key] = value;
      });
    } catch (e) {
    }
  }
  url.searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
__name(parseParametersFromURL, "parseParametersFromURL");
function decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthInvalidJwtError("Invalid JWT structure");
  }
  for (let i = 0; i < parts.length; i++) {
    if (!BASE64URL_REGEX.test(parts[i])) {
      throw new AuthInvalidJwtError("JWT not in base64url format");
    }
  }
  const data = {
    // using base64url lib
    header: JSON.parse(stringFromBase64URL(parts[0])),
    payload: JSON.parse(stringFromBase64URL(parts[1])),
    signature: base64UrlToUint8Array(parts[2]),
    raw: {
      header: parts[0],
      payload: parts[1]
    }
  };
  return data;
}
__name(decodeJWT, "decodeJWT");
async function sleep(time) {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time);
  });
}
__name(sleep, "sleep");
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    ;
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
__name(retryable, "retryable");
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
__name(dec2hex, "dec2hex");
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array = new Uint32Array(verifierLength);
  if (typeof crypto === "undefined") {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const charSetLen = charSet.length;
    let verifier = "";
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}
__name(generatePKCEVerifier, "generatePKCEVerifier");
async function sha256(randomString) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(randomString);
  const hash = await crypto.subtle.digest("SHA-256", encodedData);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
}
__name(sha256, "sha256");
async function generatePKCEChallenge(verifier) {
  const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
  if (!hasCryptoSupport) {
    console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
    return verifier;
  }
  const hashed = await sha256(verifier);
  return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(generatePKCEChallenge, "generatePKCEChallenge");
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
  const codeVerifier = generatePKCEVerifier();
  let storedCodeVerifier = codeVerifier;
  if (isPasswordRecovery) {
    storedCodeVerifier += "/PASSWORD_RECOVERY";
  }
  await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
  const codeChallenge = await generatePKCEChallenge(codeVerifier);
  const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
  return [codeChallenge, codeChallengeMethod];
}
__name(getCodeChallengeAndMethod, "getCodeChallengeAndMethod");
function parseResponseAPIVersion(response) {
  const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
  if (!apiVersion) {
    return null;
  }
  if (!apiVersion.match(API_VERSION_REGEX)) {
    return null;
  }
  try {
    const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
    return date;
  } catch (e) {
    return null;
  }
}
__name(parseResponseAPIVersion, "parseResponseAPIVersion");
function validateExp(exp) {
  if (!exp) {
    throw new Error("Missing exp claim");
  }
  const timeNow = Math.floor(Date.now() / 1e3);
  if (exp <= timeNow) {
    throw new Error("JWT has expired");
  }
}
__name(validateExp, "validateExp");
function getAlgorithm(alg) {
  switch (alg) {
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      };
    case "ES256":
      return {
        name: "ECDSA",
        namedCurve: "P-256",
        hash: { name: "SHA-256" }
      };
    default:
      throw new Error("Invalid alg claim");
  }
}
__name(getAlgorithm, "getAlgorithm");
function validateUUID(str) {
  if (!UUID_REGEX.test(str)) {
    throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
  }
}
__name(validateUUID, "validateUUID");
function userNotAvailableProxy() {
  const proxyTarget = {};
  return new Proxy(proxyTarget, {
    get: /* @__PURE__ */ __name2((target, prop) => {
      if (prop === "__isUserNotAvailableProxy") {
        return true;
      }
      if (typeof prop === "symbol") {
        const sProp = prop.toString();
        if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)") {
          return void 0;
        }
      }
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${prop}" property of the session object is not supported. Please use getUser() instead.`);
    }, "get"),
    set: /* @__PURE__ */ __name2((_target, prop) => {
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
    }, "set"),
    deleteProperty: /* @__PURE__ */ __name2((_target, prop) => {
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
    }, "deleteProperty")
  });
}
__name(userNotAvailableProxy, "userNotAvailableProxy");
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
__name(deepClone, "deepClone");
var isBrowser;
var localStorageWriteTests;
var supportsLocalStorage;
var resolveFetch4;
var looksLikeFetchResponse;
var setItemAsync;
var getItemAsync;
var removeItemAsync;
var Deferred;
var API_VERSION_REGEX;
var UUID_REGEX;
var init_helpers3 = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/helpers.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_constants4();
    init_errors2();
    init_base64url();
    __name2(expiresAt, "expiresAt");
    __name2(uuid, "uuid");
    isBrowser = /* @__PURE__ */ __name2(() => typeof window !== "undefined" && typeof document !== "undefined", "isBrowser");
    localStorageWriteTests = {
      tested: false,
      writable: false
    };
    supportsLocalStorage = /* @__PURE__ */ __name2(() => {
      if (!isBrowser()) {
        return false;
      }
      try {
        if (typeof globalThis.localStorage !== "object") {
          return false;
        }
      } catch (e) {
        return false;
      }
      if (localStorageWriteTests.tested) {
        return localStorageWriteTests.writable;
      }
      const randomKey = `lswt-${Math.random()}${Math.random()}`;
      try {
        globalThis.localStorage.setItem(randomKey, randomKey);
        globalThis.localStorage.removeItem(randomKey);
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = true;
      } catch (e) {
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = false;
      }
      return localStorageWriteTests.writable;
    }, "supportsLocalStorage");
    __name2(parseParametersFromURL, "parseParametersFromURL");
    resolveFetch4 = /* @__PURE__ */ __name2((customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = /* @__PURE__ */ __name2((...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args)), "_fetch");
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    }, "resolveFetch");
    looksLikeFetchResponse = /* @__PURE__ */ __name2((maybeResponse) => {
      return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
    }, "looksLikeFetchResponse");
    setItemAsync = /* @__PURE__ */ __name2(async (storage, key, data) => {
      await storage.setItem(key, JSON.stringify(data));
    }, "setItemAsync");
    getItemAsync = /* @__PURE__ */ __name2(async (storage, key) => {
      const value = await storage.getItem(key);
      if (!value) {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch (_a) {
        return value;
      }
    }, "getItemAsync");
    removeItemAsync = /* @__PURE__ */ __name2(async (storage, key) => {
      await storage.removeItem(key);
    }, "removeItemAsync");
    Deferred = class _Deferred {
      static {
        __name(this, "_Deferred");
      }
      static {
        __name2(this, "Deferred");
      }
      constructor() {
        ;
        this.promise = new _Deferred.promiseConstructor((res, rej) => {
          ;
          this.resolve = res;
          this.reject = rej;
        });
      }
    };
    Deferred.promiseConstructor = Promise;
    __name2(decodeJWT, "decodeJWT");
    __name2(sleep, "sleep");
    __name2(retryable, "retryable");
    __name2(dec2hex, "dec2hex");
    __name2(generatePKCEVerifier, "generatePKCEVerifier");
    __name2(sha256, "sha256");
    __name2(generatePKCEChallenge, "generatePKCEChallenge");
    __name2(getCodeChallengeAndMethod, "getCodeChallengeAndMethod");
    API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
    __name2(parseResponseAPIVersion, "parseResponseAPIVersion");
    __name2(validateExp, "validateExp");
    __name2(getAlgorithm, "getAlgorithm");
    UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    __name2(validateUUID, "validateUUID");
    __name2(userNotAvailableProxy, "userNotAvailableProxy");
    __name2(deepClone, "deepClone");
  }
});
async function handleError2(error) {
  var _a;
  if (!looksLikeFetchResponse(error)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error), 0);
  }
  if (NETWORK_ERROR_CODES.includes(error.status)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error), error.status);
  }
  let data;
  try {
    data = await error.json();
  } catch (e) {
    throw new AuthUnknownError(_getErrorMessage2(e), e);
  }
  let errorCode = void 0;
  const responseAPIVersion = parseResponseAPIVersion(error);
  if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
    errorCode = data.code;
  } else if (typeof data === "object" && data && typeof data.error_code === "string") {
    errorCode = data.error_code;
  }
  if (!errorCode) {
    if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
      throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, data.weak_password.reasons);
    }
  } else if (errorCode === "weak_password") {
    throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
  } else if (errorCode === "session_not_found") {
    throw new AuthSessionMissingError();
  }
  throw new AuthApiError(_getErrorMessage2(data), error.status || 500, errorCode);
}
__name(handleError2, "handleError2");
async function _request(fetcher, method, url, options) {
  var _a;
  const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
  if (!headers[API_VERSION_HEADER_NAME]) {
    headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
  }
  if (options === null || options === void 0 ? void 0 : options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  }
  const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
  if (options === null || options === void 0 ? void 0 : options.redirectTo) {
    qs["redirect_to"] = options.redirectTo;
  }
  const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
  const data = await _handleRequest2(fetcher, method, url + queryString, {
    headers,
    noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
  }, {}, options === null || options === void 0 ? void 0 : options.body);
  return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
}
__name(_request, "_request");
async function _handleRequest2(fetcher, method, url, options, parameters, body) {
  const requestParams = _getRequestParams2(method, options, parameters, body);
  let result;
  try {
    result = await fetcher(url, Object.assign({}, requestParams));
  } catch (e) {
    console.error(e);
    throw new AuthRetryableFetchError(_getErrorMessage2(e), 0);
  }
  if (!result.ok) {
    await handleError2(result);
  }
  if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError2(e);
  }
}
__name(_handleRequest2, "_handleRequest2");
function _sessionResponse(data) {
  var _a;
  let session = null;
  if (hasSession(data)) {
    session = Object.assign({}, data);
    if (!data.expires_at) {
      session.expires_at = expiresAt(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { session, user }, error: null };
}
__name(_sessionResponse, "_sessionResponse");
function _sessionResponsePassword(data) {
  const response = _sessionResponse(data);
  if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
    response.data.weak_password = data.weak_password;
  }
  return response;
}
__name(_sessionResponsePassword, "_sessionResponsePassword");
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { user }, error: null };
}
__name(_userResponse, "_userResponse");
function _ssoResponse(data) {
  return { data, error: null };
}
__name(_ssoResponse, "_ssoResponse");
function _generateLinkResponse(data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
__name(_generateLinkResponse, "_generateLinkResponse");
function _noResolveJsonResponse(data) {
  return data;
}
__name(_noResolveJsonResponse, "_noResolveJsonResponse");
function hasSession(data) {
  return data.access_token && data.refresh_token && data.expires_in;
}
__name(hasSession, "hasSession");
var __rest;
var _getErrorMessage2;
var NETWORK_ERROR_CODES;
var _getRequestParams2;
var init_fetch3 = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/fetch.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_constants4();
    init_helpers3();
    init_errors2();
    __rest = /* @__PURE__ */ __name(function(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    }, "__rest");
    _getErrorMessage2 = /* @__PURE__ */ __name2((err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err), "_getErrorMessage");
    NETWORK_ERROR_CODES = [502, 503, 504];
    __name2(handleError2, "handleError");
    _getRequestParams2 = /* @__PURE__ */ __name2((method, options, parameters, body) => {
      const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
      if (method === "GET") {
        return params;
      }
      params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
      params.body = JSON.stringify(body);
      return Object.assign(Object.assign({}, params), parameters);
    }, "_getRequestParams");
    __name2(_request, "_request");
    __name2(_handleRequest2, "_handleRequest");
    __name2(_sessionResponse, "_sessionResponse");
    __name2(_sessionResponsePassword, "_sessionResponsePassword");
    __name2(_userResponse, "_userResponse");
    __name2(_ssoResponse, "_ssoResponse");
    __name2(_generateLinkResponse, "_generateLinkResponse");
    __name2(_noResolveJsonResponse, "_noResolveJsonResponse");
    __name2(hasSession, "hasSession");
  }
});
var SIGN_OUT_SCOPES;
var init_types3 = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/types.js"() {
    init_functionsRoutes_0_2592004221498543();
    SIGN_OUT_SCOPES = ["global", "local", "others"];
  }
});
var __rest2;
var GoTrueAdminApi;
var init_GoTrueAdminApi = __esm({
  "../node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_fetch3();
    init_helpers3();
    init_types3();
    init_errors2();
    __rest2 = /* @__PURE__ */ __name(function(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    }, "__rest2");
    GoTrueAdminApi = class {
      static {
        __name(this, "GoTrueAdminApi");
      }
      static {
        __name2(this, "GoTrueAdminApi");
      }
      constructor({ url = "", headers = {}, fetch: fetch3 }) {
        this.url = url;
        this.headers = headers;
        this.fetch = resolveFetch4(fetch3);
        this.mfa = {
          listFactors: this._listFactors.bind(this),
          deleteFactor: this._deleteFactor.bind(this)
        };
      }
      /**
       * Removes a logged-in session.
       * @param jwt A valid, logged-in JWT.
       * @param scope The logout sope.
       */
      async signOut(jwt, scope = SIGN_OUT_SCOPES[0]) {
        if (SIGN_OUT_SCOPES.indexOf(scope) < 0) {
          throw new Error(`@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(", ")}`);
        }
        try {
          await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
            headers: this.headers,
            jwt,
            noResolveJson: true
          });
          return { data: null, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Sends an invite link to an email address.
       * @param email The email address of the user.
       * @param options Additional options to be included when inviting.
       */
      async inviteUserByEmail(email, options = {}) {
        try {
          return await _request(this.fetch, "POST", `${this.url}/invite`, {
            body: { email, data: options.data },
            headers: this.headers,
            redirectTo: options.redirectTo,
            xform: _userResponse
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Generates email links and OTPs to be sent via a custom email provider.
       * @param email The user's email.
       * @param options.password User password. For signup only.
       * @param options.data Optional user metadata. For signup only.
       * @param options.redirectTo The redirect url which should be appended to the generated link
       */
      async generateLink(params) {
        try {
          const { options } = params, rest = __rest2(params, ["options"]);
          const body = Object.assign(Object.assign({}, rest), options);
          if ("newEmail" in rest) {
            body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
            delete body["newEmail"];
          }
          return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
            body,
            headers: this.headers,
            xform: _generateLinkResponse,
            redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
          });
        } catch (error) {
          if (isAuthError(error)) {
            return {
              data: {
                properties: null,
                user: null
              },
              error
            };
          }
          throw error;
        }
      }
      // User Admin API
      /**
       * Creates a new user.
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async createUser(attributes) {
        try {
          return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
            body: attributes,
            headers: this.headers,
            xform: _userResponse
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Get a list of users.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
       */
      async listUsers(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
          const pagination = { nextPage: null, lastPage: 0, total: 0 };
          const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
            headers: this.headers,
            noResolveJson: true,
            query: {
              page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
              per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
            },
            xform: _noResolveJsonResponse
          });
          if (response.error)
            throw response.error;
          const users = await response.json();
          const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
          const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
          if (links.length > 0) {
            links.forEach((link) => {
              const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
              const rel = JSON.parse(link.split(";")[1].split("=")[1]);
              pagination[`${rel}Page`] = page;
            });
            pagination.total = parseInt(total);
          }
          return { data: Object.assign(Object.assign({}, users), pagination), error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { users: [] }, error };
          }
          throw error;
        }
      }
      /**
       * Get user by id.
       *
       * @param uid The user's unique identifier
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async getUserById(uid) {
        validateUUID(uid);
        try {
          return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
            headers: this.headers,
            xform: _userResponse
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Updates the user data.
       *
       * @param attributes The data you want to update.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async updateUserById(uid, attributes) {
        validateUUID(uid);
        try {
          return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
            body: attributes,
            headers: this.headers,
            xform: _userResponse
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Delete a user. Requires a `service_role` key.
       *
       * @param id The user id you want to remove.
       * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
       * Defaults to false for backward compatibility.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async deleteUser(id, shouldSoftDelete = false) {
        validateUUID(id);
        try {
          return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
            headers: this.headers,
            body: {
              should_soft_delete: shouldSoftDelete
            },
            xform: _userResponse
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      async _listFactors(params) {
        validateUUID(params.userId);
        try {
          const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
            headers: this.headers,
            xform: /* @__PURE__ */ __name2((factors) => {
              return { data: { factors }, error: null };
            }, "xform")
          });
          return { data, error };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      async _deleteFactor(params) {
        validateUUID(params.userId);
        validateUUID(params.id);
        try {
          const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
            headers: this.headers
          });
          return { data, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
    };
  }
});
function memoryLocalStorageAdapter(store = {}) {
  return {
    getItem: /* @__PURE__ */ __name2((key) => {
      return store[key] || null;
    }, "getItem"),
    setItem: /* @__PURE__ */ __name2((key, value) => {
      store[key] = value;
    }, "setItem"),
    removeItem: /* @__PURE__ */ __name2((key) => {
      delete store[key];
    }, "removeItem")
  };
}
__name(memoryLocalStorageAdapter, "memoryLocalStorageAdapter");
var init_local_storage = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/local-storage.js"() {
    init_functionsRoutes_0_2592004221498543();
    __name2(memoryLocalStorageAdapter, "memoryLocalStorageAdapter");
  }
});
function polyfillGlobalThis() {
  if (typeof globalThis === "object")
    return;
  try {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: /* @__PURE__ */ __name2(function() {
        return this;
      }, "get"),
      configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== "undefined") {
      self.globalThis = self;
    }
  }
}
__name(polyfillGlobalThis, "polyfillGlobalThis");
var init_polyfills = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/polyfills.js"() {
    init_functionsRoutes_0_2592004221498543();
    __name2(polyfillGlobalThis, "polyfillGlobalThis");
  }
});
async function navigatorLock(name, acquireTimeout, fn) {
  if (internals.debug) {
    console.log("@supabase/gotrue-js: navigatorLock: acquire lock", name, acquireTimeout);
  }
  const abortController = new globalThis.AbortController();
  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock acquire timed out", name);
      }
    }, acquireTimeout);
  }
  return await Promise.resolve().then(() => globalThis.navigator.locks.request(name, acquireTimeout === 0 ? {
    mode: "exclusive",
    ifAvailable: true
  } : {
    mode: "exclusive",
    signal: abortController.signal
  }, async (lock) => {
    if (lock) {
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock: acquired", name, lock.name);
      }
      try {
        return await fn();
      } finally {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: released", name, lock.name);
        }
      }
    } else {
      if (acquireTimeout === 0) {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: not immediately available", name);
        }
        throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
      } else {
        if (internals.debug) {
          try {
            const result = await globalThis.navigator.locks.query();
            console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(result, null, "  "));
          } catch (e) {
            console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e);
          }
        }
        console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request");
        return await fn();
      }
    }
  }));
}
__name(navigatorLock, "navigatorLock");
var internals;
var LockAcquireTimeoutError;
var NavigatorLockAcquireTimeoutError;
var init_locks = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/locks.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_helpers3();
    internals = {
      /**
       * @experimental
       */
      debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
    };
    LockAcquireTimeoutError = class extends Error {
      static {
        __name(this, "LockAcquireTimeoutError");
      }
      static {
        __name2(this, "LockAcquireTimeoutError");
      }
      constructor(message) {
        super(message);
        this.isAcquireTimeout = true;
      }
    };
    NavigatorLockAcquireTimeoutError = class extends LockAcquireTimeoutError {
      static {
        __name(this, "NavigatorLockAcquireTimeoutError");
      }
      static {
        __name2(this, "NavigatorLockAcquireTimeoutError");
      }
    };
    __name2(navigatorLock, "navigatorLock");
  }
});
function getAddress(address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error(`@supabase/auth-js: Address "${address}" is invalid.`);
  }
  return address.toLowerCase();
}
__name(getAddress, "getAddress");
function fromHex(hex) {
  return parseInt(hex, 16);
}
__name(fromHex, "fromHex");
function toHex(value) {
  const bytes = new TextEncoder().encode(value);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return "0x" + hex;
}
__name(toHex, "toHex");
function createSiweMessage(parameters) {
  var _a;
  const { chainId, domain, expirationTime, issuedAt = /* @__PURE__ */ new Date(), nonce, notBefore, requestId, resources, scheme, uri, version: version5 } = parameters;
  {
    if (!Number.isInteger(chainId))
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${chainId}`);
    if (!domain)
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);
    if (nonce && nonce.length < 8)
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${nonce}`);
    if (!uri)
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);
    if (version5 !== "1")
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${version5}`);
    if ((_a = parameters.statement) === null || _a === void 0 ? void 0 : _a.includes("\n"))
      throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${parameters.statement}`);
  }
  const address = getAddress(parameters.address);
  const origin = scheme ? `${scheme}://${domain}` : domain;
  const statement = parameters.statement ? `${parameters.statement}
` : "";
  const prefix = `${origin} wants you to sign in with your Ethereum account:
${address}

${statement}`;
  let suffix = `URI: ${uri}
Version: ${version5}
Chain ID: ${chainId}${nonce ? `
Nonce: ${nonce}` : ""}
Issued At: ${issuedAt.toISOString()}`;
  if (expirationTime)
    suffix += `
Expiration Time: ${expirationTime.toISOString()}`;
  if (notBefore)
    suffix += `
Not Before: ${notBefore.toISOString()}`;
  if (requestId)
    suffix += `
Request ID: ${requestId}`;
  if (resources) {
    let content = "\nResources:";
    for (const resource of resources) {
      if (!resource || typeof resource !== "string")
        throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${resource}`);
      content += `
- ${resource}`;
    }
    suffix += content;
  }
  return `${prefix}
${suffix}`;
}
__name(createSiweMessage, "createSiweMessage");
var init_ethereum = __esm({
  "../node_modules/@supabase/auth-js/dist/module/lib/web3/ethereum.js"() {
    init_functionsRoutes_0_2592004221498543();
    __name2(getAddress, "getAddress");
    __name2(fromHex, "fromHex");
    __name2(toHex, "toHex");
    __name2(createSiweMessage, "createSiweMessage");
  }
});
async function lockNoOp(name, acquireTimeout, fn) {
  return await fn();
}
__name(lockNoOp, "lockNoOp");
var DEFAULT_OPTIONS;
var GLOBAL_JWKS;
var GoTrueClient;
var init_GoTrueClient = __esm({
  "../node_modules/@supabase/auth-js/dist/module/GoTrueClient.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_GoTrueAdminApi();
    init_constants4();
    init_errors2();
    init_fetch3();
    init_helpers3();
    init_local_storage();
    init_polyfills();
    init_version4();
    init_locks();
    init_base64url();
    init_ethereum();
    polyfillGlobalThis();
    DEFAULT_OPTIONS = {
      url: GOTRUE_URL,
      storageKey: STORAGE_KEY,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      headers: DEFAULT_HEADERS3,
      flowType: "implicit",
      debug: false,
      hasCustomAuthorizationHeader: false
    };
    __name2(lockNoOp, "lockNoOp");
    GLOBAL_JWKS = {};
    GoTrueClient = class _GoTrueClient {
      static {
        __name(this, "_GoTrueClient");
      }
      static {
        __name2(this, "GoTrueClient");
      }
      /**
       * Create a new client for use in the browser.
       */
      constructor(options) {
        var _a, _b;
        this.userStorage = null;
        this.memoryStorage = null;
        this.stateChangeEmitters = /* @__PURE__ */ new Map();
        this.autoRefreshTicker = null;
        this.visibilityChangedCallback = null;
        this.refreshingDeferred = null;
        this.initializePromise = null;
        this.detectSessionInUrl = true;
        this.hasCustomAuthorizationHeader = false;
        this.suppressGetSessionWarning = false;
        this.lockAcquired = false;
        this.pendingInLock = [];
        this.broadcastChannel = null;
        this.logger = console.log;
        this.instanceID = _GoTrueClient.nextInstanceID;
        _GoTrueClient.nextInstanceID += 1;
        if (this.instanceID > 0 && isBrowser()) {
          console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
        }
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
        this.logDebugMessages = !!settings.debug;
        if (typeof settings.debug === "function") {
          this.logger = settings.debug;
        }
        this.persistSession = settings.persistSession;
        this.storageKey = settings.storageKey;
        this.autoRefreshToken = settings.autoRefreshToken;
        this.admin = new GoTrueAdminApi({
          url: settings.url,
          headers: settings.headers,
          fetch: settings.fetch
        });
        this.url = settings.url;
        this.headers = settings.headers;
        this.fetch = resolveFetch4(settings.fetch);
        this.lock = settings.lock || lockNoOp;
        this.detectSessionInUrl = settings.detectSessionInUrl;
        this.flowType = settings.flowType;
        this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
        if (settings.lock) {
          this.lock = settings.lock;
        } else if (isBrowser() && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.locks)) {
          this.lock = navigatorLock;
        } else {
          this.lock = lockNoOp;
        }
        if (!this.jwks) {
          this.jwks = { keys: [] };
          this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
        }
        this.mfa = {
          verify: this._verify.bind(this),
          enroll: this._enroll.bind(this),
          unenroll: this._unenroll.bind(this),
          challenge: this._challenge.bind(this),
          listFactors: this._listFactors.bind(this),
          challengeAndVerify: this._challengeAndVerify.bind(this),
          getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
        };
        if (this.persistSession) {
          if (settings.storage) {
            this.storage = settings.storage;
          } else {
            if (supportsLocalStorage()) {
              this.storage = globalThis.localStorage;
            } else {
              this.memoryStorage = {};
              this.storage = memoryLocalStorageAdapter(this.memoryStorage);
            }
          }
          if (settings.userStorage) {
            this.userStorage = settings.userStorage;
          }
        } else {
          this.memoryStorage = {};
          this.storage = memoryLocalStorageAdapter(this.memoryStorage);
        }
        if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
          try {
            this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
          } catch (e) {
            console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
          }
          (_b = this.broadcastChannel) === null || _b === void 0 ? void 0 : _b.addEventListener("message", async (event) => {
            this._debug("received broadcast notification from other tab or client", event);
            await this._notifyAllSubscribers(event.data.event, event.data.session, false);
          });
        }
        this.initialize();
      }
      /**
       * The JWKS used for verifying asymmetric JWTs
       */
      get jwks() {
        var _a, _b;
        return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.jwks) !== null && _b !== void 0 ? _b : { keys: [] };
      }
      set jwks(value) {
        GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { jwks: value });
      }
      get jwks_cached_at() {
        var _a, _b;
        return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.cachedAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
      }
      set jwks_cached_at(value) {
        GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { cachedAt: value });
      }
      _debug(...args) {
        if (this.logDebugMessages) {
          this.logger(`GoTrueClient@${this.instanceID} (${version4}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...args);
        }
        return this;
      }
      /**
       * Initializes the client session either from the url or from storage.
       * This method is automatically called when instantiating the client, but should also be called
       * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
       */
      async initialize() {
        if (this.initializePromise) {
          return await this.initializePromise;
        }
        this.initializePromise = (async () => {
          return await this._acquireLock(-1, async () => {
            return await this._initialize();
          });
        })();
        return await this.initializePromise;
      }
      /**
       * IMPORTANT:
       * 1. Never throw in this method, as it is called from the constructor
       * 2. Never return a session from this method as it would be cached over
       *    the whole lifetime of the client
       */
      async _initialize() {
        var _a;
        try {
          const params = parseParametersFromURL(window.location.href);
          let callbackUrlType = "none";
          if (this._isImplicitGrantCallback(params)) {
            callbackUrlType = "implicit";
          } else if (await this._isPKCECallback(params)) {
            callbackUrlType = "pkce";
          }
          if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
            const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
            if (error) {
              this._debug("#_initialize()", "error detecting session from URL", error);
              if (isAuthImplicitGrantRedirectError(error)) {
                const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
                if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
                  return { error };
                }
              }
              await this._removeSession();
              return { error };
            }
            const { session, redirectType } = data;
            this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
            await this._saveSession(session);
            setTimeout(async () => {
              if (redirectType === "recovery") {
                await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
              } else {
                await this._notifyAllSubscribers("SIGNED_IN", session);
              }
            }, 0);
            return { error: null };
          }
          await this._recoverAndRefresh();
          return { error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { error };
          }
          return {
            error: new AuthUnknownError("Unexpected error during initialization", error)
          };
        } finally {
          await this._handleVisibilityChange();
          this._debug("#_initialize()", "end");
        }
      }
      /**
       * Creates a new anonymous user.
       *
       * @returns A session where the is_anonymous claim in the access token JWT set to true
       */
      async signInAnonymously(credentials) {
        var _a, _b, _c;
        try {
          const res = await _request(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            body: {
              data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
              gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
            },
            xform: _sessionResponse
          });
          const { data, error } = res;
          if (error || !data) {
            return { data: { user: null, session: null }, error };
          }
          const session = data.session;
          const user = data.user;
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
          return { data: { user, session }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Creates a new user.
       *
       * Be aware that if a user account exists in the system you may get back an
       * error message that attempts to hide this information from the user.
       * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
       *
       * @returns A logged-in session if the server has "autoconfirm" ON
       * @returns A user if the server has "autoconfirm" OFF
       */
      async signUp(credentials) {
        var _a, _b, _c;
        try {
          let res;
          if ("email" in credentials) {
            const { email, password, options } = credentials;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce") {
              ;
              [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
            }
            res = await _request(this.fetch, "POST", `${this.url}/signup`, {
              headers: this.headers,
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
              body: {
                email,
                password,
                data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod
              },
              xform: _sessionResponse
            });
          } else if ("phone" in credentials) {
            const { phone, password, options } = credentials;
            res = await _request(this.fetch, "POST", `${this.url}/signup`, {
              headers: this.headers,
              body: {
                phone,
                password,
                data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
                channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              xform: _sessionResponse
            });
          } else {
            throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
          }
          const { data, error } = res;
          if (error || !data) {
            return { data: { user: null, session: null }, error };
          }
          const session = data.session;
          const user = data.user;
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
          return { data: { user, session }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Log in an existing user with an email and password or phone and password.
       *
       * Be aware that you may get back an error message that will not distinguish
       * between the cases where the account does not exist or that the
       * email/phone and password combination is wrong or that the account can only
       * be accessed via social login.
       */
      async signInWithPassword(credentials) {
        try {
          let res;
          if ("email" in credentials) {
            const { email, password, options } = credentials;
            res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
              headers: this.headers,
              body: {
                email,
                password,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              xform: _sessionResponsePassword
            });
          } else if ("phone" in credentials) {
            const { phone, password, options } = credentials;
            res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
              headers: this.headers,
              body: {
                phone,
                password,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              xform: _sessionResponsePassword
            });
          } else {
            throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
          }
          const { data, error } = res;
          if (error) {
            return { data: { user: null, session: null }, error };
          } else if (!data || !data.session || !data.user) {
            return { data: { user: null, session: null }, error: new AuthInvalidTokenResponseError() };
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return {
            data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
            error
          };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Log in an existing user via a third-party provider.
       * This method supports the PKCE flow.
       */
      async signInWithOAuth(credentials) {
        var _a, _b, _c, _d;
        return await this._handleProviderSignIn(credentials.provider, {
          redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
        });
      }
      /**
       * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
       */
      async exchangeCodeForSession(authCode) {
        await this.initializePromise;
        return this._acquireLock(-1, async () => {
          return this._exchangeCodeForSession(authCode);
        });
      }
      /**
       * Signs in a user by verifying a message signed by the user's private key.
       * Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards,
       * both of which derive from the EIP-4361 standard
       * With slight variation on Solana's side.
       * @reference https://eips.ethereum.org/EIPS/eip-4361
       */
      async signInWithWeb3(credentials) {
        const { chain } = credentials;
        switch (chain) {
          case "ethereum":
            return await this.signInWithEthereum(credentials);
          case "solana":
            return await this.signInWithSolana(credentials);
          default:
            throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
        }
      }
      async signInWithEthereum(credentials) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        let message;
        let signature;
        if ("message" in credentials) {
          message = credentials.message;
          signature = credentials.signature;
        } else {
          const { chain, wallet, statement, options } = credentials;
          let resolvedWallet;
          if (!isBrowser()) {
            if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
              throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            }
            resolvedWallet = wallet;
          } else if (typeof wallet === "object") {
            resolvedWallet = wallet;
          } else {
            const windowAny = window;
            if ("ethereum" in windowAny && typeof windowAny.ethereum === "object" && "request" in windowAny.ethereum && typeof windowAny.ethereum.request === "function") {
              resolvedWallet = windowAny.ethereum;
            } else {
              throw new Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`);
            }
          }
          const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
          const accounts = await resolvedWallet.request({
            method: "eth_requestAccounts"
          }).then((accs) => accs).catch(() => {
            throw new Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`);
          });
          if (!accounts || accounts.length === 0) {
            throw new Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);
          }
          const address = getAddress(accounts[0]);
          let chainId = (_b = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _b === void 0 ? void 0 : _b.chainId;
          if (!chainId) {
            const chainIdHex = await resolvedWallet.request({
              method: "eth_chainId"
            });
            chainId = fromHex(chainIdHex);
          }
          const siweMessage = {
            domain: url.host,
            address,
            statement,
            uri: url.href,
            version: "1",
            chainId,
            nonce: (_c = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _c === void 0 ? void 0 : _c.nonce,
            issuedAt: (_e = (_d = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _d === void 0 ? void 0 : _d.issuedAt) !== null && _e !== void 0 ? _e : /* @__PURE__ */ new Date(),
            expirationTime: (_f = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _f === void 0 ? void 0 : _f.expirationTime,
            notBefore: (_g = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _g === void 0 ? void 0 : _g.notBefore,
            requestId: (_h = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _h === void 0 ? void 0 : _h.requestId,
            resources: (_j = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _j === void 0 ? void 0 : _j.resources
          };
          message = createSiweMessage(siweMessage);
          signature = await resolvedWallet.request({
            method: "personal_sign",
            params: [toHex(message), address]
          });
        }
        try {
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
            headers: this.headers,
            body: Object.assign({
              chain: "ethereum",
              message,
              signature
            }, ((_k = credentials.options) === null || _k === void 0 ? void 0 : _k.captchaToken) ? { gotrue_meta_security: { captcha_token: (_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken } } : null),
            xform: _sessionResponse
          });
          if (error) {
            throw error;
          }
          if (!data || !data.session || !data.user) {
            return {
              data: { user: null, session: null },
              error: new AuthInvalidTokenResponseError()
            };
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return { data: Object.assign({}, data), error };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      async signInWithSolana(credentials) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let message;
        let signature;
        if ("message" in credentials) {
          message = credentials.message;
          signature = credentials.signature;
        } else {
          const { chain, wallet, statement, options } = credentials;
          let resolvedWallet;
          if (!isBrowser()) {
            if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
              throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            }
            resolvedWallet = wallet;
          } else if (typeof wallet === "object") {
            resolvedWallet = wallet;
          } else {
            const windowAny = window;
            if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) {
              resolvedWallet = windowAny.solana;
            } else {
              throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
            }
          }
          const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
          if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
            const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
              // non-overridable properties
              version: "1",
              domain: url.host,
              uri: url.href
            }), statement ? { statement } : null));
            let outputToProcess;
            if (Array.isArray(output) && output[0] && typeof output[0] === "object") {
              outputToProcess = output[0];
            } else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) {
              outputToProcess = output;
            } else {
              throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
            }
            if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
              message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
              signature = outputToProcess.signature;
            } else {
              throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            }
          } else {
            if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") {
              throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
            }
            message = [
              `${url.host} wants you to sign in with your Solana account:`,
              resolvedWallet.publicKey.toBase58(),
              ...statement ? ["", statement, ""] : [""],
              "Version: 1",
              `URI: ${url.href}`,
              `Issued At: ${(_c = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c !== void 0 ? _c : (/* @__PURE__ */ new Date()).toISOString()}`,
              ...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
              ...((_e = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _e === void 0 ? void 0 : _e.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
              ...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
              ...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
              ...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
              ...((_k = (_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.resources) === null || _k === void 0 ? void 0 : _k.length) ? [
                "Resources",
                ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)
              ] : []
            ].join("\n");
            const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
            if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) {
              throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
            }
            signature = maybeSignature;
          }
        }
        try {
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
            headers: this.headers,
            body: Object.assign({ chain: "solana", message, signature: bytesToBase64URL(signature) }, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
            xform: _sessionResponse
          });
          if (error) {
            throw error;
          }
          if (!data || !data.session || !data.user) {
            return {
              data: { user: null, session: null },
              error: new AuthInvalidTokenResponseError()
            };
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return { data: Object.assign({}, data), error };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      async _exchangeCodeForSession(authCode) {
        const storageItem = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
        try {
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
            headers: this.headers,
            body: {
              auth_code: authCode,
              code_verifier: codeVerifier
            },
            xform: _sessionResponse
          });
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          if (error) {
            throw error;
          }
          if (!data || !data.session || !data.user) {
            return {
              data: { user: null, session: null, redirectType: null },
              error: new AuthInvalidTokenResponseError()
            };
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return { data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null, redirectType: null }, error };
          }
          throw error;
        }
      }
      /**
       * Allows signing in with an OIDC ID token. The authentication provider used
       * should be enabled and configured.
       */
      async signInWithIdToken(credentials) {
        try {
          const { options, provider, token, access_token, nonce } = credentials;
          const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
            headers: this.headers,
            body: {
              provider,
              id_token: token,
              access_token,
              nonce,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: _sessionResponse
          });
          const { data, error } = res;
          if (error) {
            return { data: { user: null, session: null }, error };
          } else if (!data || !data.session || !data.user) {
            return {
              data: { user: null, session: null },
              error: new AuthInvalidTokenResponseError()
            };
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return { data, error };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Log in a user using magiclink or a one-time password (OTP).
       *
       * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
       * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
       * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
       *
       * Be aware that you may get back an error message that will not distinguish
       * between the cases where the account does not exist or, that the account
       * can only be accessed via social login.
       *
       * Do note that you will need to configure a Whatsapp sender on Twilio
       * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
       * channel is not supported on other providers
       * at this time.
       * This method supports PKCE when an email is passed.
       */
      async signInWithOtp(credentials) {
        var _a, _b, _c, _d, _e;
        try {
          if ("email" in credentials) {
            const { email, options } = credentials;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce") {
              ;
              [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
            }
            const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
              headers: this.headers,
              body: {
                email,
                data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
                create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod
              },
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
            });
            return { data: { user: null, session: null }, error };
          }
          if ("phone" in credentials) {
            const { phone, options } = credentials;
            const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
              headers: this.headers,
              body: {
                phone,
                data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
                create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : "sms"
              }
            });
            return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
          }
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
       */
      async verifyOtp(params) {
        var _a, _b;
        try {
          let redirectTo = void 0;
          let captchaToken = void 0;
          if ("options" in params) {
            redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
            captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
            headers: this.headers,
            body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
            redirectTo,
            xform: _sessionResponse
          });
          if (error) {
            throw error;
          }
          if (!data) {
            throw new Error("An error occurred on token verification.");
          }
          const session = data.session;
          const user = data.user;
          if (session === null || session === void 0 ? void 0 : session.access_token) {
            await this._saveSession(session);
            await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
          }
          return { data: { user, session }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Attempts a single-sign on using an enterprise Identity Provider. A
       * successful SSO attempt will redirect the current page to the identity
       * provider authorization page. The redirect URL is implementation and SSO
       * protocol specific.
       *
       * You can use it by providing a SSO domain. Typically you can extract this
       * domain by asking users for their email address. If this domain is
       * registered on the Auth instance the redirect will use that organization's
       * currently active SSO Identity Provider for the login.
       *
       * If you have built an organization-specific login page, you can use the
       * organization's SSO Identity Provider UUID directly instead.
       */
      async signInWithSSO(params) {
        var _a, _b, _c;
        try {
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce") {
            ;
            [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          }
          return await _request(this.fetch, "POST", `${this.url}/sso`, {
            body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
            headers: this.headers,
            xform: _ssoResponse
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Sends a reauthentication OTP to the user's email or phone number.
       * Requires the user to be signed-in.
       */
      async reauthenticate() {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._reauthenticate();
        });
      }
      async _reauthenticate() {
        try {
          return await this._useSession(async (result) => {
            const { data: { session }, error: sessionError } = result;
            if (sessionError)
              throw sessionError;
            if (!session)
              throw new AuthSessionMissingError();
            const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
              headers: this.headers,
              jwt: session.access_token
            });
            return { data: { user: null, session: null }, error };
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
       */
      async resend(credentials) {
        try {
          const endpoint = `${this.url}/resend`;
          if ("email" in credentials) {
            const { email, type, options } = credentials;
            const { error } = await _request(this.fetch, "POST", endpoint, {
              headers: this.headers,
              body: {
                email,
                type,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
            });
            return { data: { user: null, session: null }, error };
          } else if ("phone" in credentials) {
            const { phone, type, options } = credentials;
            const { data, error } = await _request(this.fetch, "POST", endpoint, {
              headers: this.headers,
              body: {
                phone,
                type,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              }
            });
            return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
          }
          throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Returns the session, refreshing it if necessary.
       *
       * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
       *
       * **IMPORTANT:** This method loads values directly from the storage attached
       * to the client. If that storage is based on request cookies for example,
       * the values in it may not be authentic and therefore it's strongly advised
       * against using this method and its results in such circumstances. A warning
       * will be emitted if this is detected. Use {@link #getUser()} instead.
       */
      async getSession() {
        await this.initializePromise;
        const result = await this._acquireLock(-1, async () => {
          return this._useSession(async (result2) => {
            return result2;
          });
        });
        return result;
      }
      /**
       * Acquires a global lock based on the storage key.
       */
      async _acquireLock(acquireTimeout, fn) {
        this._debug("#_acquireLock", "begin", acquireTimeout);
        try {
          if (this.lockAcquired) {
            const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
            const result = (async () => {
              await last;
              return await fn();
            })();
            this.pendingInLock.push((async () => {
              try {
                await result;
              } catch (e) {
              }
            })());
            return result;
          }
          return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
            this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
            try {
              this.lockAcquired = true;
              const result = fn();
              this.pendingInLock.push((async () => {
                try {
                  await result;
                } catch (e) {
                }
              })());
              await result;
              while (this.pendingInLock.length) {
                const waitOn = [...this.pendingInLock];
                await Promise.all(waitOn);
                this.pendingInLock.splice(0, waitOn.length);
              }
              return await result;
            } finally {
              this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
              this.lockAcquired = false;
            }
          });
        } finally {
          this._debug("#_acquireLock", "end");
        }
      }
      /**
       * Use instead of {@link #getSession} inside the library. It is
       * semantically usually what you want, as getting a session involves some
       * processing afterwards that requires only one client operating on the
       * session at once across multiple tabs or processes.
       */
      async _useSession(fn) {
        this._debug("#_useSession", "begin");
        try {
          const result = await this.__loadSession();
          return await fn(result);
        } finally {
          this._debug("#_useSession", "end");
        }
      }
      /**
       * NEVER USE DIRECTLY!
       *
       * Always use {@link #_useSession}.
       */
      async __loadSession() {
        this._debug("#__loadSession()", "begin");
        if (!this.lockAcquired) {
          this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
        }
        try {
          let currentSession = null;
          const maybeSession = await getItemAsync(this.storage, this.storageKey);
          this._debug("#getSession()", "session from storage", maybeSession);
          if (maybeSession !== null) {
            if (this._isValidSession(maybeSession)) {
              currentSession = maybeSession;
            } else {
              this._debug("#getSession()", "session from storage is not valid");
              await this._removeSession();
            }
          }
          if (!currentSession) {
            return { data: { session: null }, error: null };
          }
          const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
          this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
          if (!hasExpired) {
            if (this.userStorage) {
              const maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
              if (maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) {
                currentSession.user = maybeUser.user;
              } else {
                currentSession.user = userNotAvailableProxy();
              }
            }
            if (this.storage.isServer && currentSession.user) {
              let suppressWarning = this.suppressGetSessionWarning;
              const proxySession = new Proxy(currentSession, {
                get: /* @__PURE__ */ __name2((target, prop, receiver) => {
                  if (!suppressWarning && prop === "user") {
                    console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
                    suppressWarning = true;
                    this.suppressGetSessionWarning = true;
                  }
                  return Reflect.get(target, prop, receiver);
                }, "get")
              });
              currentSession = proxySession;
            }
            return { data: { session: currentSession }, error: null };
          }
          const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            return { data: { session: null }, error };
          }
          return { data: { session }, error: null };
        } finally {
          this._debug("#__loadSession()", "end");
        }
      }
      /**
       * Gets the current user details if there is an existing session. This method
       * performs a network request to the Supabase Auth server, so the returned
       * value is authentic and can be used to base authorization rules on.
       *
       * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
       */
      async getUser(jwt) {
        if (jwt) {
          return await this._getUser(jwt);
        }
        await this.initializePromise;
        const result = await this._acquireLock(-1, async () => {
          return await this._getUser();
        });
        return result;
      }
      async _getUser(jwt) {
        try {
          if (jwt) {
            return await _request(this.fetch, "GET", `${this.url}/user`, {
              headers: this.headers,
              jwt,
              xform: _userResponse
            });
          }
          return await this._useSession(async (result) => {
            var _a, _b, _c;
            const { data, error } = result;
            if (error) {
              throw error;
            }
            if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
              return { data: { user: null }, error: new AuthSessionMissingError() };
            }
            return await _request(this.fetch, "GET", `${this.url}/user`, {
              headers: this.headers,
              jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
              xform: _userResponse
            });
          });
        } catch (error) {
          if (isAuthError(error)) {
            if (isAuthSessionMissingError(error)) {
              await this._removeSession();
              await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
            }
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Updates user data for a logged in user.
       */
      async updateUser(attributes, options = {}) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._updateUser(attributes, options);
        });
      }
      async _updateUser(attributes, options = {}) {
        try {
          return await this._useSession(async (result) => {
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              throw sessionError;
            }
            if (!sessionData.session) {
              throw new AuthSessionMissingError();
            }
            const session = sessionData.session;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce" && attributes.email != null) {
              ;
              [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
            }
            const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
              headers: this.headers,
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
              body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
              jwt: session.access_token,
              xform: _userResponse
            });
            if (userError)
              throw userError;
            session.user = data.user;
            await this._saveSession(session);
            await this._notifyAllSubscribers("USER_UPDATED", session);
            return { data: { user: session.user }, error: null };
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
       * If the refresh token or access token in the current session is invalid, an error will be thrown.
       * @param currentSession The current session that minimally contains an access token and refresh token.
       */
      async setSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._setSession(currentSession);
        });
      }
      async _setSession(currentSession) {
        try {
          if (!currentSession.access_token || !currentSession.refresh_token) {
            throw new AuthSessionMissingError();
          }
          const timeNow = Date.now() / 1e3;
          let expiresAt2 = timeNow;
          let hasExpired = true;
          let session = null;
          const { payload } = decodeJWT(currentSession.access_token);
          if (payload.exp) {
            expiresAt2 = payload.exp;
            hasExpired = expiresAt2 <= timeNow;
          }
          if (hasExpired) {
            const { session: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
            if (error) {
              return { data: { user: null, session: null }, error };
            }
            if (!refreshedSession) {
              return { data: { user: null, session: null }, error: null };
            }
            session = refreshedSession;
          } else {
            const { data, error } = await this._getUser(currentSession.access_token);
            if (error) {
              throw error;
            }
            session = {
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
              user: data.user,
              token_type: "bearer",
              expires_in: expiresAt2 - timeNow,
              expires_at: expiresAt2
            };
            await this._saveSession(session);
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
          return { data: { user: session.user, session }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { session: null, user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Returns a new session, regardless of expiry status.
       * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
       * If the current session's refresh token is invalid, an error will be thrown.
       * @param currentSession The current session. If passed in, it must contain a refresh token.
       */
      async refreshSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._refreshSession(currentSession);
        });
      }
      async _refreshSession(currentSession) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            if (!currentSession) {
              const { data, error: error2 } = result;
              if (error2) {
                throw error2;
              }
              currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
            }
            if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
              throw new AuthSessionMissingError();
            }
            const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
            if (error) {
              return { data: { user: null, session: null }, error };
            }
            if (!session) {
              return { data: { user: null, session: null }, error: null };
            }
            return { data: { user: session.user, session }, error: null };
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { user: null, session: null }, error };
          }
          throw error;
        }
      }
      /**
       * Gets the session data from a URL string
       */
      async _getSessionFromURL(params, callbackUrlType) {
        try {
          if (!isBrowser())
            throw new AuthImplicitGrantRedirectError("No browser detected.");
          if (params.error || params.error_description || params.error_code) {
            throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
              error: params.error || "unspecified_error",
              code: params.error_code || "unspecified_code"
            });
          }
          switch (callbackUrlType) {
            case "implicit":
              if (this.flowType === "pkce") {
                throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
              }
              break;
            case "pkce":
              if (this.flowType === "implicit") {
                throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
              }
              break;
            default:
          }
          if (callbackUrlType === "pkce") {
            this._debug("#_initialize()", "begin", "is PKCE flow", true);
            if (!params.code)
              throw new AuthPKCEGrantCodeExchangeError("No code detected.");
            const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
            if (error2)
              throw error2;
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            window.history.replaceState(window.history.state, "", url.toString());
            return { data: { session: data2.session, redirectType: null }, error: null };
          }
          const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
          if (!access_token || !expires_in || !refresh_token || !token_type) {
            throw new AuthImplicitGrantRedirectError("No session defined in URL");
          }
          const timeNow = Math.round(Date.now() / 1e3);
          const expiresIn = parseInt(expires_in);
          let expiresAt2 = timeNow + expiresIn;
          if (expires_at) {
            expiresAt2 = parseInt(expires_at);
          }
          const actuallyExpiresIn = expiresAt2 - timeNow;
          if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION_MS) {
            console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
          }
          const issuedAt = expiresAt2 - expiresIn;
          if (timeNow - issuedAt >= 120) {
            console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
          } else if (timeNow - issuedAt < 0) {
            console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt2, timeNow);
          }
          const { data, error } = await this._getUser(access_token);
          if (error)
            throw error;
          const session = {
            provider_token,
            provider_refresh_token,
            access_token,
            expires_in: expiresIn,
            expires_at: expiresAt2,
            refresh_token,
            token_type,
            user: data.user
          };
          window.location.hash = "";
          this._debug("#_getSessionFromURL()", "clearing window.location.hash");
          return { data: { session, redirectType: params.type }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { session: null, redirectType: null }, error };
          }
          throw error;
        }
      }
      /**
       * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
       */
      _isImplicitGrantCallback(params) {
        return Boolean(params.access_token || params.error_description);
      }
      /**
       * Checks if the current URL and backing storage contain parameters given by a PKCE flow
       */
      async _isPKCECallback(params) {
        const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        return !!(params.code && currentStorageContent);
      }
      /**
       * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
       *
       * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
       * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
       *
       * If using `others` scope, no `SIGNED_OUT` event is fired!
       */
      async signOut(options = { scope: "global" }) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._signOut(options);
        });
      }
      async _signOut({ scope } = { scope: "global" }) {
        return await this._useSession(async (result) => {
          var _a;
          const { data, error: sessionError } = result;
          if (sessionError) {
            return { error: sessionError };
          }
          const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
          if (accessToken) {
            const { error } = await this.admin.signOut(accessToken, scope);
            if (error) {
              if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403))) {
                return { error };
              }
            }
          }
          if (scope !== "others") {
            await this._removeSession();
            await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
          }
          return { error: null };
        });
      }
      /**
       * Receive a notification every time an auth event happens.
       * @param callback A callback function to be invoked when an auth event happens.
       */
      onAuthStateChange(callback) {
        const id = uuid();
        const subscription = {
          id,
          callback,
          unsubscribe: /* @__PURE__ */ __name2(() => {
            this._debug("#unsubscribe()", "state change callback with id removed", id);
            this.stateChangeEmitters.delete(id);
          }, "unsubscribe")
        };
        this._debug("#onAuthStateChange()", "registered callback with id", id);
        this.stateChangeEmitters.set(id, subscription);
        (async () => {
          await this.initializePromise;
          await this._acquireLock(-1, async () => {
            this._emitInitialSession(id);
          });
        })();
        return { data: { subscription } };
      }
      async _emitInitialSession(id) {
        return await this._useSession(async (result) => {
          var _a, _b;
          try {
            const { data: { session }, error } = result;
            if (error)
              throw error;
            await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
            this._debug("INITIAL_SESSION", "callback id", id, "session", session);
          } catch (err) {
            await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
            this._debug("INITIAL_SESSION", "callback id", id, "error", err);
            console.error(err);
          }
        });
      }
      /**
       * Sends a password reset request to an email address. This method supports the PKCE flow.
       *
       * @param email The email address of the user.
       * @param options.redirectTo The URL to send the user to after they click the password reset link.
       * @param options.captchaToken Verification token received when the user completes the captcha on the site.
       */
      async resetPasswordForEmail(email, options = {}) {
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(
            this.storage,
            this.storageKey,
            true
            // isPasswordRecovery
          );
        }
        try {
          return await _request(this.fetch, "POST", `${this.url}/recover`, {
            body: {
              email,
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod,
              gotrue_meta_security: { captcha_token: options.captchaToken }
            },
            headers: this.headers,
            redirectTo: options.redirectTo
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Gets all the identities linked to a user.
       */
      async getUserIdentities() {
        var _a;
        try {
          const { data, error } = await this.getUser();
          if (error)
            throw error;
          return { data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Links an oauth identity to an existing user.
       * This method supports the PKCE flow.
       */
      async linkIdentity(credentials) {
        var _a;
        try {
          const { data, error } = await this._useSession(async (result) => {
            var _a2, _b, _c, _d, _e;
            const { data: data2, error: error2 } = result;
            if (error2)
              throw error2;
            const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
              redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
              scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
              queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
              skipBrowserRedirect: true
            });
            return await _request(this.fetch, "GET", url, {
              headers: this.headers,
              jwt: (_e = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : void 0
            });
          });
          if (error)
            throw error;
          if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
            window.location.assign(data === null || data === void 0 ? void 0 : data.url);
          }
          return { data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url }, error: null };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: { provider: credentials.provider, url: null }, error };
          }
          throw error;
        }
      }
      /**
       * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
       */
      async unlinkIdentity(identity) {
        try {
          return await this._useSession(async (result) => {
            var _a, _b;
            const { data, error } = result;
            if (error) {
              throw error;
            }
            return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
              headers: this.headers,
              jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
            });
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Generates a new JWT.
       * @param refreshToken A valid refresh token that was returned on login.
       */
      async _refreshAccessToken(refreshToken) {
        const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, "begin");
        try {
          const startedAt = Date.now();
          return await retryable(async (attempt) => {
            if (attempt > 0) {
              await sleep(200 * Math.pow(2, attempt - 1));
            }
            this._debug(debugName, "refreshing attempt", attempt);
            return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
              body: { refresh_token: refreshToken },
              headers: this.headers,
              xform: _sessionResponse
            });
          }, (attempt, error) => {
            const nextBackOffInterval = 200 * Math.pow(2, attempt);
            return error && isAuthRetryableFetchError(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
            Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION_MS;
          });
        } catch (error) {
          this._debug(debugName, "error", error);
          if (isAuthError(error)) {
            return { data: { session: null, user: null }, error };
          }
          throw error;
        } finally {
          this._debug(debugName, "end");
        }
      }
      _isValidSession(maybeSession) {
        const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
        return isValidSession;
      }
      async _handleProviderSignIn(provider, options) {
        const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
          redirectTo: options.redirectTo,
          scopes: options.scopes,
          queryParams: options.queryParams
        });
        this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
        if (isBrowser() && !options.skipBrowserRedirect) {
          window.location.assign(url);
        }
        return { data: { provider, url }, error: null };
      }
      /**
       * Recovers the session from LocalStorage and refreshes the token
       * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
       */
      async _recoverAndRefresh() {
        var _a, _b;
        const debugName = "#_recoverAndRefresh()";
        this._debug(debugName, "begin");
        try {
          const currentSession = await getItemAsync(this.storage, this.storageKey);
          if (currentSession && this.userStorage) {
            let maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
            if (!this.storage.isServer && Object.is(this.storage, this.userStorage) && !maybeUser) {
              maybeUser = { user: currentSession.user };
              await setItemAsync(this.userStorage, this.storageKey + "-user", maybeUser);
            }
            currentSession.user = (_a = maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) !== null && _a !== void 0 ? _a : userNotAvailableProxy();
          } else if (currentSession && !currentSession.user) {
            if (!currentSession.user) {
              const separateUser = await getItemAsync(this.storage, this.storageKey + "-user");
              if (separateUser && (separateUser === null || separateUser === void 0 ? void 0 : separateUser.user)) {
                currentSession.user = separateUser.user;
                await removeItemAsync(this.storage, this.storageKey + "-user");
                await setItemAsync(this.storage, this.storageKey, currentSession);
              } else {
                currentSession.user = userNotAvailableProxy();
              }
            }
          }
          this._debug(debugName, "session from storage", currentSession);
          if (!this._isValidSession(currentSession)) {
            this._debug(debugName, "session is not valid");
            if (currentSession !== null) {
              await this._removeSession();
            }
            return;
          }
          const expiresWithMargin = ((_b = currentSession.expires_at) !== null && _b !== void 0 ? _b : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
          this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
          if (expiresWithMargin) {
            if (this.autoRefreshToken && currentSession.refresh_token) {
              const { error } = await this._callRefreshToken(currentSession.refresh_token);
              if (error) {
                console.error(error);
                if (!isAuthRetryableFetchError(error)) {
                  this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error);
                  await this._removeSession();
                }
              }
            }
          } else if (currentSession.user && currentSession.user.__isUserNotAvailableProxy === true) {
            try {
              const { data, error: userError } = await this._getUser(currentSession.access_token);
              if (!userError && (data === null || data === void 0 ? void 0 : data.user)) {
                currentSession.user = data.user;
                await this._saveSession(currentSession);
                await this._notifyAllSubscribers("SIGNED_IN", currentSession);
              } else {
                this._debug(debugName, "could not get user data, skipping SIGNED_IN notification");
              }
            } catch (getUserError) {
              console.error("Error getting user data:", getUserError);
              this._debug(debugName, "error getting user data, skipping SIGNED_IN notification", getUserError);
            }
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", currentSession);
          }
        } catch (err) {
          this._debug(debugName, "error", err);
          console.error(err);
          return;
        } finally {
          this._debug(debugName, "end");
        }
      }
      async _callRefreshToken(refreshToken) {
        var _a, _b;
        if (!refreshToken) {
          throw new AuthSessionMissingError();
        }
        if (this.refreshingDeferred) {
          return this.refreshingDeferred.promise;
        }
        const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, "begin");
        try {
          this.refreshingDeferred = new Deferred();
          const { data, error } = await this._refreshAccessToken(refreshToken);
          if (error)
            throw error;
          if (!data.session)
            throw new AuthSessionMissingError();
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
          const result = { session: data.session, error: null };
          this.refreshingDeferred.resolve(result);
          return result;
        } catch (error) {
          this._debug(debugName, "error", error);
          if (isAuthError(error)) {
            const result = { session: null, error };
            if (!isAuthRetryableFetchError(error)) {
              await this._removeSession();
            }
            (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
            return result;
          }
          (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
          throw error;
        } finally {
          this.refreshingDeferred = null;
          this._debug(debugName, "end");
        }
      }
      async _notifyAllSubscribers(event, session, broadcast = true) {
        const debugName = `#_notifyAllSubscribers(${event})`;
        this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
        try {
          if (this.broadcastChannel && broadcast) {
            this.broadcastChannel.postMessage({ event, session });
          }
          const errors = [];
          const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
            try {
              await x.callback(event, session);
            } catch (e) {
              errors.push(e);
            }
          });
          await Promise.all(promises);
          if (errors.length > 0) {
            for (let i = 0; i < errors.length; i += 1) {
              console.error(errors[i]);
            }
            throw errors[0];
          }
        } finally {
          this._debug(debugName, "end");
        }
      }
      /**
       * set currentSession and currentUser
       * process to _startAutoRefreshToken if possible
       */
      async _saveSession(session) {
        this._debug("#_saveSession()", session);
        this.suppressGetSessionWarning = true;
        const sessionToProcess = Object.assign({}, session);
        const userIsProxy = sessionToProcess.user && sessionToProcess.user.__isUserNotAvailableProxy === true;
        if (this.userStorage) {
          if (!userIsProxy && sessionToProcess.user) {
            await setItemAsync(this.userStorage, this.storageKey + "-user", {
              user: sessionToProcess.user
            });
          } else if (userIsProxy) {
          }
          const mainSessionData = Object.assign({}, sessionToProcess);
          delete mainSessionData.user;
          const clonedMainSessionData = deepClone(mainSessionData);
          await setItemAsync(this.storage, this.storageKey, clonedMainSessionData);
        } else {
          const clonedSession = deepClone(sessionToProcess);
          await setItemAsync(this.storage, this.storageKey, clonedSession);
        }
      }
      async _removeSession() {
        this._debug("#_removeSession()");
        await removeItemAsync(this.storage, this.storageKey);
        await removeItemAsync(this.storage, this.storageKey + "-code-verifier");
        await removeItemAsync(this.storage, this.storageKey + "-user");
        if (this.userStorage) {
          await removeItemAsync(this.userStorage, this.storageKey + "-user");
        }
        await this._notifyAllSubscribers("SIGNED_OUT", null);
      }
      /**
       * Removes any registered visibilitychange callback.
       *
       * {@see #startAutoRefresh}
       * {@see #stopAutoRefresh}
       */
      _removeVisibilityChangedCallback() {
        this._debug("#_removeVisibilityChangedCallback()");
        const callback = this.visibilityChangedCallback;
        this.visibilityChangedCallback = null;
        try {
          if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
            window.removeEventListener("visibilitychange", callback);
          }
        } catch (e) {
          console.error("removing visibilitychange callback failed", e);
        }
      }
      /**
       * This is the private implementation of {@link #startAutoRefresh}. Use this
       * within the library.
       */
      async _startAutoRefresh() {
        await this._stopAutoRefresh();
        this._debug("#_startAutoRefresh()");
        const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
        this.autoRefreshTicker = ticker;
        if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
          ticker.unref();
        } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
          Deno.unrefTimer(ticker);
        }
        setTimeout(async () => {
          await this.initializePromise;
          await this._autoRefreshTokenTick();
        }, 0);
      }
      /**
       * This is the private implementation of {@link #stopAutoRefresh}. Use this
       * within the library.
       */
      async _stopAutoRefresh() {
        this._debug("#_stopAutoRefresh()");
        const ticker = this.autoRefreshTicker;
        this.autoRefreshTicker = null;
        if (ticker) {
          clearInterval(ticker);
        }
      }
      /**
       * Starts an auto-refresh process in the background. The session is checked
       * every few seconds. Close to the time of expiration a process is started to
       * refresh the session. If refreshing fails it will be retried for as long as
       * necessary.
       *
       * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
       * to call this function, it will be called for you.
       *
       * On browsers the refresh process works only when the tab/window is in the
       * foreground to conserve resources as well as prevent race conditions and
       * flooding auth with requests. If you call this method any managed
       * visibility change callback will be removed and you must manage visibility
       * changes on your own.
       *
       * On non-browser platforms the refresh process works *continuously* in the
       * background, which may not be desirable. You should hook into your
       * platform's foreground indication mechanism and call these methods
       * appropriately to conserve resources.
       *
       * {@see #stopAutoRefresh}
       */
      async startAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._startAutoRefresh();
      }
      /**
       * Stops an active auto refresh process running in the background (if any).
       *
       * If you call this method any managed visibility change callback will be
       * removed and you must manage visibility changes on your own.
       *
       * See {@link #startAutoRefresh} for more details.
       */
      async stopAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._stopAutoRefresh();
      }
      /**
       * Runs the auto refresh token tick.
       */
      async _autoRefreshTokenTick() {
        this._debug("#_autoRefreshTokenTick()", "begin");
        try {
          await this._acquireLock(0, async () => {
            try {
              const now = Date.now();
              try {
                return await this._useSession(async (result) => {
                  const { data: { session } } = result;
                  if (!session || !session.refresh_token || !session.expires_at) {
                    this._debug("#_autoRefreshTokenTick()", "no session");
                    return;
                  }
                  const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
                  this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
                  if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                    await this._callRefreshToken(session.refresh_token);
                  }
                });
              } catch (e) {
                console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
              }
            } finally {
              this._debug("#_autoRefreshTokenTick()", "end");
            }
          });
        } catch (e) {
          if (e.isAcquireTimeout || e instanceof LockAcquireTimeoutError) {
            this._debug("auto refresh token tick lock not available");
          } else {
            throw e;
          }
        }
      }
      /**
       * Registers callbacks on the browser / platform, which in-turn run
       * algorithms when the browser window/tab are in foreground. On non-browser
       * platforms it assumes always foreground.
       */
      async _handleVisibilityChange() {
        this._debug("#_handleVisibilityChange()");
        if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
          if (this.autoRefreshToken) {
            this.startAutoRefresh();
          }
          return false;
        }
        try {
          this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
          window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
          await this._onVisibilityChanged(true);
        } catch (error) {
          console.error("_handleVisibilityChange", error);
        }
      }
      /**
       * Callback registered with `window.addEventListener('visibilitychange')`.
       */
      async _onVisibilityChanged(calledFromInitialize) {
        const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
        this._debug(methodName, "visibilityState", document.visibilityState);
        if (document.visibilityState === "visible") {
          if (this.autoRefreshToken) {
            this._startAutoRefresh();
          }
          if (!calledFromInitialize) {
            await this.initializePromise;
            await this._acquireLock(-1, async () => {
              if (document.visibilityState !== "visible") {
                this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
                return;
              }
              await this._recoverAndRefresh();
            });
          }
        } else if (document.visibilityState === "hidden") {
          if (this.autoRefreshToken) {
            this._stopAutoRefresh();
          }
        }
      }
      /**
       * Generates the relevant login URL for a third-party provider.
       * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
       * @param options.scopes A space-separated list of scopes granted to the OAuth application.
       * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
       */
      async _getUrlForProvider(url, provider, options) {
        const urlParams = [`provider=${encodeURIComponent(provider)}`];
        if (options === null || options === void 0 ? void 0 : options.redirectTo) {
          urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
        }
        if (options === null || options === void 0 ? void 0 : options.scopes) {
          urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
        }
        if (this.flowType === "pkce") {
          const [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
          const flowParams = new URLSearchParams({
            code_challenge: `${encodeURIComponent(codeChallenge)}`,
            code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
          });
          urlParams.push(flowParams.toString());
        }
        if (options === null || options === void 0 ? void 0 : options.queryParams) {
          const query = new URLSearchParams(options.queryParams);
          urlParams.push(query.toString());
        }
        if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
          urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
        }
        return `${url}?${urlParams.join("&")}`;
      }
      async _unenroll(params) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return { data: null, error: sessionError };
            }
            return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      async _enroll(params) {
        try {
          return await this._useSession(async (result) => {
            var _a, _b;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return { data: null, error: sessionError };
            }
            const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : { issuer: params.issuer });
            const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
              body,
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (error) {
              return { data: null, error };
            }
            if (params.factorType === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
              data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
            }
            return { data, error: null };
          });
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * {@see GoTrueMFAApi#verify}
       */
      async _verify(params) {
        return this._acquireLock(-1, async () => {
          try {
            return await this._useSession(async (result) => {
              var _a;
              const { data: sessionData, error: sessionError } = result;
              if (sessionError) {
                return { data: null, error: sessionError };
              }
              const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
                body: { code: params.code, challenge_id: params.challengeId },
                headers: this.headers,
                jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
              });
              if (error) {
                return { data: null, error };
              }
              await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
              await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
              return { data, error };
            });
          } catch (error) {
            if (isAuthError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * {@see GoTrueMFAApi#challenge}
       */
      async _challenge(params) {
        return this._acquireLock(-1, async () => {
          try {
            return await this._useSession(async (result) => {
              var _a;
              const { data: sessionData, error: sessionError } = result;
              if (sessionError) {
                return { data: null, error: sessionError };
              }
              return await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
                body: { channel: params.channel },
                headers: this.headers,
                jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
              });
            });
          } catch (error) {
            if (isAuthError(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * {@see GoTrueMFAApi#challengeAndVerify}
       */
      async _challengeAndVerify(params) {
        const { data: challengeData, error: challengeError } = await this._challenge({
          factorId: params.factorId
        });
        if (challengeError) {
          return { data: null, error: challengeError };
        }
        return await this._verify({
          factorId: params.factorId,
          challengeId: challengeData.id,
          code: params.code
        });
      }
      /**
       * {@see GoTrueMFAApi#listFactors}
       */
      async _listFactors() {
        const { data: { user }, error: userError } = await this.getUser();
        if (userError) {
          return { data: null, error: userError };
        }
        const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
        const totp = factors.filter((factor) => factor.factor_type === "totp" && factor.status === "verified");
        const phone = factors.filter((factor) => factor.factor_type === "phone" && factor.status === "verified");
        return {
          data: {
            all: factors,
            totp,
            phone
          },
          error: null
        };
      }
      /**
       * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
       */
      async _getAuthenticatorAssuranceLevel() {
        return this._acquireLock(-1, async () => {
          return await this._useSession(async (result) => {
            var _a, _b;
            const { data: { session }, error: sessionError } = result;
            if (sessionError) {
              return { data: null, error: sessionError };
            }
            if (!session) {
              return {
                data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
                error: null
              };
            }
            const { payload } = decodeJWT(session.access_token);
            let currentLevel = null;
            if (payload.aal) {
              currentLevel = payload.aal;
            }
            let nextLevel = currentLevel;
            const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
            if (verifiedFactors.length > 0) {
              nextLevel = "aal2";
            }
            const currentAuthenticationMethods = payload.amr || [];
            return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
          });
        });
      }
      async fetchJwk(kid, jwks = { keys: [] }) {
        let jwk = jwks.keys.find((key) => key.kid === kid);
        if (jwk) {
          return jwk;
        }
        const now = Date.now();
        jwk = this.jwks.keys.find((key) => key.kid === kid);
        if (jwk && this.jwks_cached_at + JWKS_TTL > now) {
          return jwk;
        }
        const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
          headers: this.headers
        });
        if (error) {
          throw error;
        }
        if (!data.keys || data.keys.length === 0) {
          return null;
        }
        this.jwks = data;
        this.jwks_cached_at = now;
        jwk = data.keys.find((key) => key.kid === kid);
        if (!jwk) {
          return null;
        }
        return jwk;
      }
      /**
       * Extracts the JWT claims present in the access token by first verifying the
       * JWT against the server's JSON Web Key Set endpoint
       * `/.well-known/jwks.json` which is often cached, resulting in significantly
       * faster responses. Prefer this method over {@link #getUser} which always
       * sends a request to the Auth server for each JWT.
       *
       * If the project is not using an asymmetric JWT signing key (like ECC or
       * RSA) it always sends a request to the Auth server (similar to {@link
       * #getUser}) to verify the JWT.
       *
       * @param jwt An optional specific JWT you wish to verify, not the one you
       *            can obtain from {@link #getSession}.
       * @param options Various additional options that allow you to customize the
       *                behavior of this method.
       */
      async getClaims(jwt, options = {}) {
        try {
          let token = jwt;
          if (!token) {
            const { data, error } = await this.getSession();
            if (error || !data.session) {
              return { data: null, error };
            }
            token = data.session.access_token;
          }
          const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
          if (!(options === null || options === void 0 ? void 0 : options.allowExpired)) {
            validateExp(payload.exp);
          }
          const signingKey = !header.alg || header.alg.startsWith("HS") || !header.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(header.kid, (options === null || options === void 0 ? void 0 : options.keys) ? { keys: options.keys } : options === null || options === void 0 ? void 0 : options.jwks);
          if (!signingKey) {
            const { error } = await this.getUser(token);
            if (error) {
              throw error;
            }
            return {
              data: {
                claims: payload,
                header,
                signature
              },
              error: null
            };
          }
          const algorithm = getAlgorithm(header.alg);
          const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
            "verify"
          ]);
          const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`));
          if (!isValid) {
            throw new AuthInvalidJwtError("Invalid JWT signature");
          }
          return {
            data: {
              claims: payload,
              header,
              signature
            },
            error: null
          };
        } catch (error) {
          if (isAuthError(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
    };
    GoTrueClient.nextInstanceID = 0;
  }
});
var init_AuthAdminApi = __esm({
  "../node_modules/@supabase/auth-js/dist/module/AuthAdminApi.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_GoTrueAdminApi();
  }
});
var AuthClient;
var AuthClient_default;
var init_AuthClient = __esm({
  "../node_modules/@supabase/auth-js/dist/module/AuthClient.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_GoTrueClient();
    AuthClient = GoTrueClient;
    AuthClient_default = AuthClient;
  }
});
var init_module4 = __esm({
  "../node_modules/@supabase/auth-js/dist/module/index.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_GoTrueAdminApi();
    init_GoTrueClient();
    init_AuthAdminApi();
    init_AuthClient();
    init_types3();
    init_errors2();
    init_locks();
  }
});
var SupabaseAuthClient;
var init_SupabaseAuthClient = __esm({
  "../node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_module4();
    SupabaseAuthClient = class extends AuthClient_default {
      static {
        __name(this, "SupabaseAuthClient");
      }
      static {
        __name2(this, "SupabaseAuthClient");
      }
      constructor(options) {
        super(options);
      }
    };
  }
});
var __awaiter10;
var SupabaseClient;
var init_SupabaseClient = __esm({
  "../node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_module();
    init_wrapper();
    init_module2();
    init_module3();
    init_constants3();
    init_fetch2();
    init_helpers2();
    init_SupabaseAuthClient();
    __awaiter10 = /* @__PURE__ */ __name(function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      __name(adopt, "adopt");
      __name2(adopt, "adopt");
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        __name(fulfilled, "fulfilled");
        __name2(fulfilled, "fulfilled");
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        __name(rejected, "rejected");
        __name2(rejected, "rejected");
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        __name(step, "step");
        __name2(step, "step");
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, "__awaiter10");
    SupabaseClient = class {
      static {
        __name(this, "SupabaseClient");
      }
      static {
        __name2(this, "SupabaseClient");
      }
      /**
       * Create a new client for use in the browser.
       * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
       * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
       * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
       * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
       * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
       * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
       * @param options.realtime Options passed along to realtime-js constructor.
       * @param options.storage Options passed along to the storage-js constructor.
       * @param options.global.fetch A custom fetch implementation.
       * @param options.global.headers Any additional headers to send with each network request.
       */
      constructor(supabaseUrl, supabaseKey, options) {
        var _a, _b, _c;
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        const baseUrl = validateSupabaseUrl(supabaseUrl);
        if (!supabaseKey)
          throw new Error("supabaseKey is required.");
        this.realtimeUrl = new URL("realtime/v1", baseUrl);
        this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
        this.authUrl = new URL("auth/v1", baseUrl);
        this.storageUrl = new URL("storage/v1", baseUrl);
        this.functionsUrl = new URL("functions/v1", baseUrl);
        const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
        const DEFAULTS = {
          db: DEFAULT_DB_OPTIONS,
          realtime: DEFAULT_REALTIME_OPTIONS,
          auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
          global: DEFAULT_GLOBAL_OPTIONS
        };
        const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
        this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
        this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
        if (!settings.accessToken) {
          this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
        } else {
          this.accessToken = settings.accessToken;
          this.auth = new Proxy({}, {
            get: /* @__PURE__ */ __name2((_, prop) => {
              throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
            }, "get")
          });
        }
        this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
        this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
        this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
          headers: this.headers,
          schema: settings.db.schema,
          fetch: this.fetch
        });
        this.storage = new StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
        if (!settings.accessToken) {
          this._listenForAuthEvents();
        }
      }
      /**
       * Supabase Functions allows you to deploy and invoke edge functions.
       */
      get functions() {
        return new FunctionsClient(this.functionsUrl.href, {
          headers: this.headers,
          customFetch: this.fetch
        });
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        return this.rest.from(relation);
      }
      // NOTE: signatures must be kept in sync with PostgrestClient.schema
      /**
       * Select a schema to query or perform an function (rpc) call.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The schema to query
       */
      schema(schema) {
        return this.rest.schema(schema);
      }
      // NOTE: signatures must be kept in sync with PostgrestClient.rpc
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.get - When set to `true`, the function will be called with
       * read-only access mode.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, options = {}) {
        return this.rest.rpc(fn, args, options);
      }
      /**
       * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
       *
       * @param {string} name - The name of the Realtime channel.
       * @param {Object} opts - The options to pass to the Realtime channel.
       *
       */
      channel(name, opts = { config: {} }) {
        return this.realtime.channel(name, opts);
      }
      /**
       * Returns all Realtime channels.
       */
      getChannels() {
        return this.realtime.getChannels();
      }
      /**
       * Unsubscribes and removes Realtime channel from Realtime client.
       *
       * @param {RealtimeChannel} channel - The name of the Realtime channel.
       *
       */
      removeChannel(channel) {
        return this.realtime.removeChannel(channel);
      }
      /**
       * Unsubscribes and removes all Realtime channels from Realtime client.
       */
      removeAllChannels() {
        return this.realtime.removeAllChannels();
      }
      _getAccessToken() {
        var _a, _b;
        return __awaiter10(this, void 0, void 0, function* () {
          if (this.accessToken) {
            return yield this.accessToken();
          }
          const { data } = yield this.auth.getSession();
          return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
        });
      }
      _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, userStorage, storageKey, flowType, lock, debug }, headers, fetch3) {
        const authHeaders = {
          Authorization: `Bearer ${this.supabaseKey}`,
          apikey: `${this.supabaseKey}`
        };
        return new SupabaseAuthClient({
          url: this.authUrl.href,
          headers: Object.assign(Object.assign({}, authHeaders), headers),
          storageKey,
          autoRefreshToken,
          persistSession,
          detectSessionInUrl,
          storage,
          userStorage,
          flowType,
          lock,
          debug,
          fetch: fetch3,
          // auth checks if there is a custom authorizaiton header using this flag
          // so it knows whether to return an error when getUser is called with no session
          hasCustomAuthorizationHeader: Object.keys(this.headers).some((key) => key.toLowerCase() === "authorization")
        });
      }
      _initRealtimeClient(options) {
        return new RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
      }
      _listenForAuthEvents() {
        let data = this.auth.onAuthStateChange((event, session) => {
          this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
        });
        return data;
      }
      _handleTokenChanged(event, source, token) {
        if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
          this.changedAccessToken = token;
          this.realtime.setAuth(token);
        } else if (event === "SIGNED_OUT") {
          this.realtime.setAuth();
          if (source == "STORAGE")
            this.auth.signOut();
          this.changedAccessToken = void 0;
        }
      }
    };
  }
});
function shouldShowDeprecationWarning() {
  if (typeof window !== "undefined") {
    return false;
  }
  if (typeof process === "undefined") {
    return false;
  }
  const processVersion = process["version"];
  if (processVersion === void 0 || processVersion === null) {
    return false;
  }
  const versionMatch = processVersion.match(/^v(\d+)\./);
  if (!versionMatch) {
    return false;
  }
  const majorVersion = parseInt(versionMatch[1], 10);
  return majorVersion <= 18;
}
__name(shouldShowDeprecationWarning, "shouldShowDeprecationWarning");
var createClient;
var init_module5 = __esm({
  "../node_modules/@supabase/supabase-js/dist/module/index.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_SupabaseClient();
    init_module4();
    init_wrapper();
    init_module2();
    createClient = /* @__PURE__ */ __name2((supabaseUrl, supabaseKey, options) => {
      return new SupabaseClient(supabaseUrl, supabaseKey, options);
    }, "createClient");
    __name2(shouldShowDeprecationWarning, "shouldShowDeprecationWarning");
    if (shouldShowDeprecationWarning()) {
      console.warn(`\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217`);
    }
  }
});
async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get("table");
    const id = url.searchParams.get("id");
    const allowedTables = ["projects", "experiences", "about"];
    if (!table || !allowedTables.includes(table)) {
      return new Response(JSON.stringify({
        error: "Invalid or missing table parameter",
        allowedTables
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabase = getSupabaseClient(env);
    let query = supabase.from(table).select("*");
    switch (table) {
      case "projects":
        query = query.order("year", { ascending: false });
        if (id) query = query.eq("id", id);
        break;
      case "experiences":
        query = query.order("period", { ascending: false });
        if (id) query = query.eq("id", id);
        break;
      case "about":
        query = query.order("id", { ascending: true });
        if (id) query = query.eq("id", id);
        break;
    }
    const { data, error } = await query;
    if (error) {
      console.error("Supabase query error:", error);
      return new Response(JSON.stringify({
        error: "Database query failed",
        details: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (id && data && data.length > 0) {
      return new Response(JSON.stringify(data[0]), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300"
          // 5 minutes cache
        }
      });
    }
    return new Response(JSON.stringify(data || []), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
        // 5 minutes cache
      }
    });
  } catch (error) {
    console.error("Data API error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestGet, "onRequestGet");
async function onRequestPost2({ request, env }) {
  try {
    const data = await request.json();
    const { action, ...params } = data;
    const supabase = getSupabaseClient(env);
    switch (action) {
      case "track_page_view":
        return await handlePageView(request, env, supabase, params);
      case "track_interaction":
        return await handleInteraction(request, env, supabase, params);
      default:
        return new Response(JSON.stringify({
          error: "Invalid action",
          allowedActions: ["track_page_view", "track_interaction"]
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return new Response(JSON.stringify({
      error: "Failed to process analytics request",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPost2, "onRequestPost2");
async function handlePageView(request, env, supabase, params) {
  try {
    const { page_path, referrer, screen_size } = params;
    const userAgent = request.headers.get("User-Agent") || "";
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "anonymous";
    const sessionId = generateSessionId(request);
    try {
      const { data, error } = await supabase.rpc("record_page_view", {
        page_path,
        user_agent: userAgent,
        ip_address: ip,
        referrer: referrer || "",
        screen_size: screen_size || ""
      });
      if (error) throw error;
      return new Response(JSON.stringify({
        success: true,
        id: data
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (rpcError) {
      console.warn("RPC failed, using direct insert:", rpcError);
      const { data: insertData, error: insertError } = await supabase.from("page_views").insert({
        page_path,
        user_agent: userAgent,
        ip_address: ip,
        referrer: referrer || "",
        screen_size: screen_size || "",
        session_id: sessionId,
        device_type: detectDeviceType(userAgent),
        browser: detectBrowser(userAgent),
        operating_system: detectOS(userAgent),
        referrer_source: categorizeSources(referrer)
      }).select("id").single();
      if (insertError) throw insertError;
      return new Response(JSON.stringify({
        success: true,
        id: insertData?.id
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("Page view tracking error:", error);
    return new Response(JSON.stringify({
      error: "Failed to track page view",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handlePageView, "handlePageView");
async function handleInteraction(request, env, supabase, params) {
  try {
    const {
      action_type,
      page_path,
      element_id,
      element_class,
      element_type,
      value,
      x_position,
      y_position
    } = params;
    const userAgent = request.headers.get("User-Agent") || "";
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "anonymous";
    const { data, error } = await supabase.rpc("record_user_interaction", {
      action_type,
      page_path,
      ip_address: ip,
      user_agent: userAgent,
      element_id: element_id || null,
      element_class: element_class || null,
      element_type: element_type || null,
      x_position: x_position || null,
      y_position: y_position || null,
      value: value || null
    });
    if (error) throw error;
    return new Response(JSON.stringify({
      success: true,
      id: data
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Interaction tracking error:", error);
    return new Response(JSON.stringify({
      error: "Failed to track interaction",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleInteraction, "handleInteraction");
async function onRequestOptions2() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
__name(onRequestOptions2, "onRequestOptions2");
var getSupabaseClient;
var detectDeviceType;
var detectBrowser;
var detectOS;
var categorizeSources;
var generateSessionId;
var init_data = __esm({
  "api/data.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_module5();
    getSupabaseClient = /* @__PURE__ */ __name2((env) => {
      if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables");
      }
      return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false
          // Server-side usage
        },
        global: {
          headers: {
            "x-application-name": "portfolio-api"
          }
        }
      });
    }, "getSupabaseClient");
    detectDeviceType = /* @__PURE__ */ __name2((userAgent) => {
      if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        return "Mobile";
      } else if (/ipad|tablet/i.test(userAgent)) {
        return "Tablet";
      } else {
        return "Desktop";
      }
    }, "detectDeviceType");
    detectBrowser = /* @__PURE__ */ __name2((userAgent) => {
      if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) {
        return "Chrome";
      } else if (/firefox/i.test(userAgent)) {
        return "Firefox";
      } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        return "Safari";
      } else if (/edge|edg/i.test(userAgent)) {
        return "Edge";
      } else if (/opera|opr/i.test(userAgent)) {
        return "Opera";
      } else if (/msie|trident/i.test(userAgent)) {
        return "Internet Explorer";
      } else {
        return "Other";
      }
    }, "detectBrowser");
    detectOS = /* @__PURE__ */ __name2((userAgent) => {
      if (/windows/i.test(userAgent)) {
        return "Windows";
      } else if (/macintosh|mac os/i.test(userAgent)) {
        return "MacOS";
      } else if (/linux/i.test(userAgent) && !/android/i.test(userAgent)) {
        return "Linux";
      } else if (/android/i.test(userAgent)) {
        return "Android";
      } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        return "iOS";
      } else {
        return "Other";
      }
    }, "detectOS");
    categorizeSources = /* @__PURE__ */ __name2((referrer) => {
      if (!referrer) {
        return "Direct";
      } else if (/google|bing|yahoo|duckduckgo/i.test(referrer)) {
        return "Search";
      } else if (/facebook|twitter|instagram|linkedin|pinterest|reddit/i.test(referrer)) {
        return "Social";
      } else {
        return "Referral";
      }
    }, "categorizeSources");
    generateSessionId = /* @__PURE__ */ __name2((request) => {
      const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
      const userAgent = request.headers.get("User-Agent") || "";
      return btoa(ip + userAgent).replace(/[^a-zA-Z0-9]/g, "").substring(0, 32);
    }, "generateSessionId");
    __name2(onRequestGet, "onRequestGet");
    __name2(onRequestPost2, "onRequestPost");
    __name2(handlePageView, "handlePageView");
    __name2(handleInteraction, "handleInteraction");
    __name2(onRequestOptions2, "onRequestOptions");
  }
});
var reasons;
var init_reasons = __esm({
  "api/reasons.js"() {
    init_functionsRoutes_0_2592004221498543();
    reasons = [
      "In a different season of life, I might say yes\u2014but not right now.",
      "While I appreciate it, pursuing this isn't something I can commit to.",
      "Every time I think about it, I hear a tiny \u2018nope\u2019 in the wind.",
      "My future self wrote me a note: \u2018Please don\u2019t do this again.\u2019",
      "It sounds interesting, but I\u2019m not the best person for this.",
      "I appreciate the thought, but it\u2019s not the right fit for me right now.",
      "I'd love to say yes, but I just made a commitment to do less questionable things this week.",
      "While I appreciate it, considering this isn't something I can commit to.",
      "While I appreciate it, volunteering for this isn't something I can commit to.",
      "I'm trying to be more intentional with what I agree to, and this doesn\u2019t quite fit.",
      "I want to be honest with you\u2014I don\u2019t feel comfortable committing to this.",
      "I have to trust my gut\u2014and it's gently suggesting a no.",
      "Saying no to this helps me say yes to something that matters more to me.",
      "If I said yes, I'd be lying to both of us\u2014and my therapist said to stop doing that.",
      "I\u2019m going to respectfully decline. It doesn\u2019t align with where I\u2019m heading.",
      "While I appreciate it, attempting this isn't something I can commit to.",
      "This opportunity deserves more than I can give it right now.",
      "I don\u2019t hate the idea\u2014but I also don\u2019t want to do it.",
      "I\u2019m not in a position to commit to this right now.",
      "While I appreciate it, exploring this isn't something I can commit to.",
      "I\u2019ve made peace with declining things that don\u2019t energize me.",
      "Even my calendar laughed when I tried to squeeze this in.",
      "I\u2019ve decided to hold off on new engagements for the time being.",
      "This feels like something Future Me would yell at Present Me for agreeing to.",
      "I\u2019ve tried doing too much before, and this feels like d\xE9j\xE0 vu.",
      "You\u2019ve put great energy into this, and I hope you understand my decision to step back.",
      "While I appreciate it, joining this isn't something I can commit to.",
      "This is a great idea\u2014for someone else to take on.",
      "The version of me who says yes to this doesn\u2019t exist anymore.",
      "Even my coffee said, \u2018Not today.\u2019",
      "My inner peace committee vetoed this idea unanimously.",
      "I know how much this matters, but I can\u2019t give it the attention it deserves.",
      "I had a vision of doing this\u2014and then promptly fell asleep in it.",
      "Mentally, I\u2019ve already left the room where this would happen.",
      "While I appreciate it, accepting this isn't something I can commit to.",
      "This doesn\u2019t align with my values or current focus.",
      "Please know that my decision isn\u2019t a reflection of you\u2014just my own boundaries.",
      "I respect the opportunity, but I know my limits\u2014and this would stretch them too far.",
      "If I took this on, I\u2019d be betraying the time I promised myself.",
      "I once made a similar decision and my cat hasn\u2019t looked me in the eye since. Let\u2019s not repeat history.",
      "If I agree, I\u2019d need to clone myself. And I don't trust him.",
      "This one doesn\u2019t feel quite right, so I\u2019ll have to pass.",
      "I'd rather say no with honesty than yes with resentment.",
      "Thanks for thinking of me, but I\u2019ll have to pass on this one.",
      "I\u2019ve taken some time to reflect, and I believe passing on this is the right call for now.",
      "I truly value our connection, and I hope my no doesn\u2019t change that.",
      "It\u2019s not a no forever, but it\u2019s a no for now.",
      "My enthusiasm is sincere, but my availability is imaginary.",
      "While I appreciate it, embracing this isn't something I can commit to.",
      "At this point, I don\u2019t have the bandwidth to do this justice.",
      "I\u2019ve learned to protect my time, and this doesn\u2019t align with how I want to spend it.",
      "That\u2019s not something I can prioritize at the moment.",
      "If I said yes, the universe might collapse from the shock.",
      "If I agree, it could break the space-time continuum.",
      "Helping you now could create a time paradox\u2014better not risk it.",
      "I can't, I'm busy preventing a future where I actually say yes.",
      "My calendar is aligned with Jupiter, and the stars say no.",
      "I'm pretty sure saying yes is forbidden in this galaxy.",
      "The multiverse would never forgive me if I complied.",
      "Any timeline where I say yes ends in chaos, so I'm choosing wisely.",
      "Me agreeing? That's like dividing by zero\u2014dangerous and not allowed.",
      "Accepting that offer would cause a glitch in the Matrix.",
      "I'm currently booked for the next decade in pretending to be productive.",
      "I\u2019d love to, but I'm swamped with counting the ceiling tiles.",
      "Sorry, I'm too busy rearranging my sock drawer by color and mood.",
      "I have a meeting with my couch and it won\u2019t take no for an answer.",
      "I've got a calendar alert to sit and stare into space at that exact time.",
      "My schedule is full: I'm alphabetizing my snacks.",
      "I need to finish an intense session of doing nothing at all.",
      "I've a prior commitment to binge-watching paint dry.",
      "I'm in the middle of a very important procrastination marathon.",
      "I can't; I'm attending the opening of my refrigerator.",
      "I'd help, but my imaginary friend needs me more.",
      "I can't; my pet rock is having an emotional crisis.",
      "My goldfish is getting married that day, I have to attend.",
      "I promised my imaginary cat I'd stay home tonight.",
      "My guardian unicorn says I shouldn't.",
      "I have to babysit my imaginary friend's imaginary kids.",
      "Unfortunately, I'm volunteering as a taste-tester for my pet's new diet.",
      "My pet dragon has a vet appointment, can't miss it.",
      "I'm grounded by my pet parrot for bad behavior, so I can't go.",
      "I lent my time machine to a friend and now I can't go back and free up this afternoon.",
      "I've made a vow to avoid any form of productivity.",
      "It's against my personal religion to do anything useful today.",
      "My psychiatrist advised me to avoid potentially fun activities.",
      "I swore an oath that I must decline all requests on a whim.",
      "I only function on coffee and denial, and I'm out of coffee.",
      "I'm allergic to any form of responsibility.",
      "I have a doctor's note that specifically forbids me from helping.",
      "I'd love to help, but I'm trying to break my streak of helpfulness.",
      "My procrastination coach said I'm not ready for actual tasks yet.",
      "I gave up saying yes for Lent, and it hasn't ended yet.",
      "I have a personal policy of saying no on days ending in 'y'.",
      "My phone's calendar just facepalmed at me for even considering it.",
      "I have to update my social media status to 'busy not doing that'.",
      "I'm currently trending towards 'no'.",
      "I can't\u2014I promised Netflix I'd stay in and watch movies.",
      "My Wi-Fi of motivation has lost connection.",
      "I'm waiting for my phone to recharge\u2014can't do anything until it's at 100%.",
      "My bio on Twitter says 'Often says no', gotta stay on brand.",
      "I'm busy searching for motivation on Google; no results found.",
      "I'm stuck in an internet rabbit hole and I can't find the exit.",
      "I can't come; I'm on a Zoom call with my couch.",
      "I would love to, but I'd rather not.",
      "My answer is a no\u2014freshly baked, just for you.",
      "I've considered it thoroughly, and I'm going with a hard no.",
      "Not even if there were free donuts.",
      "This is the part where I say 'no' and we both move on.",
      "Let me check my schedule... oh look, it's a permanent no.",
      "I'm flattered you asked, but I'll pass with flying colors.",
      "I've reached my quota of saying yes for the year.",
      "I'm too cool to say yes to that.",
      "As the saying goes, 'Nope, nope, nope.'",
      "You don't want me to say yes\u2014trust me, it's for the greater good.",
      "The last time I said yes, it rained for 40 days. Not doing that again.",
      "I promised my future self I'd say no to this one.",
      "If I agreed, I'd have to explain it to my therapist.",
      "My past experiences with yes have been traumatic.",
      "Saying yes is on my list of things to quit.",
      "I would, but then I'd have to admit I was wrong about hating everything.",
      "The universe gave me a sign to say no (it was a neon sign, very clear).",
      "I once said yes. It didn't end well. There were llamas involved.",
      "My gut feeling and I unanimously voted no.",
      "That sounds like an amazing opportunity... for someone else.",
      "What a great idea! I'm sad I can't be part of it. Well, not that sad.",
      "I envy the people who will say yes to you, truly.",
      "I absolutely adore the concept, but I'll have to sit this one out.",
      "Brilliant plan! Unfortunately, I'm in witness protection from good ideas.",
      "That would be a dream come true. Too bad I'm awake and saying no.",
      "You've painted such a lovely picture, I'll admire it from afar.",
      "Such a generous offer! I'm going to generously decline.",
      "I'm sure it'll be a resounding success, but I'll be a distant admirer.",
      "Sounds thrilling! I'm already tired just thinking about it.",
      "I've already changed into my pajamas, so it's a no.",
      "My couch has declared a no-travel zone and I'm abiding.",
      "I can't be bothered to change out of my comfortable blanket burrito.",
      "I'm saving my energy for an epic nap.",
      "I'm too lazy to even come up with a good excuse, so just no.",
      "Moving from this spot requires 24-hour notice.",
      "I'm conserving energy today for no particular reason.",
      "I would, but that sounds like effort and I'm allergic.",
      "I'm currently experiencing technical difficulties with moving.",
      "I'm practicing for a marathon of not moving.",
      "I have to wash my hair that decade.",
      "I've got to defrost the iceberg in my freezer.",
      "Sorry, I need to iron my underwear that night.",
      "I must attend to my garden of plastic flowers.",
      "My fish needs a walk and it takes priority.",
      "I have to rotate the tires on my office chair.",
      "I'm marathoning a series of doing household chores in my head.",
      "The dishes threatened to revolt if I leave them again.",
      "My fridge and I have couples therapy at that time.",
      "I need to sit this one out while I sort my sock zoo.",
      "In an alternate universe, I totally did that. Just not in this one.",
      "Maybe in my next life I'll consider it, but current me says no.",
      "In a parallel dimension I'm already on it\u2014too bad we're here.",
      "I consulted my alternate self; they also declined.",
      "If I clone myself, I'll send the clone. Until then, no.",
      "I checked with future me, and they rolled their eyes, so I'll pass.",
      "I'm stuck in a time loop of saying no.",
      "In an alternate timeline I said yes, and it caused a zombie apocalypse.",
      "My evil twin might be interested; too bad they're busy too.",
      "Somewhere in a parallel universe I\u2019m more helpful. This isn\u2019t that universe.",
      "I would, but that sounds dangerously close to work.",
      "My desire to do that is currently in a coma.",
      "I'm sure I'd mess it up spectacularly, so better not.",
      "I could participate, but then who would hold up the wall over here?",
      "That request is above my pay grade of zero.",
      "The spirit is willing, but the schedule says nope.",
      "I'd rather not tempt fate by trying something new today.",
      "If I join, I'd just bring down the average.",
      "Me doing that? That's the plot twist no one wants.",
      "I'm practicing social distancing from that idea.",
      "I have a condition that prevents me from saying yes (it's called sanity).",
      "My doctor said I need more vitamin 'No'.",
      "I just came down with a severe case of Not-Today-itis.",
      "Mentally, I'm already on vacation.",
      "I'm on bedrest until further notice, doctor's orders (my doctor is Dr. Seuss).",
      "I've got chronic commitment-phobia.",
      "I'm coming down with something; it's called laziness.",
      "I have an appointment with a pillow and a blanket.",
      "My therapist said I should avoid things that make me miserable; I assume this qualifies.",
      "I'm having a 'me' time emergency.",
      "I have to save the world from boredom by staying home.",
      "I'm in the middle of negotiating world peace (in a video game).",
      "My superhero alter ego needs a day off, and so do I.",
      "I'm on a secret mission to avoid anything you just asked.",
      "I'd love to, but then who will save the world while I'm gone?",
      "I'm busy orchestrating a global nap time.",
      "I have to keep the couch from floating away, it's an important job.",
      "The fate of the potato chip I'm about to eat is in my hands, I can't abandon it.",
      "I have been chosen as the guardian of my living room today.",
      "I'm fighting an invisible dragon at home. It's taking longer than expected.",
      "You really don't want me on this \u2013 my specialty is ruining things.",
      "I'm like a black cat of projects; it's safer if I stay away.",
      "Trust me, I'm doing you a favor by saying no.",
      "My participation comes with a warning label, so I'll spare you.",
      "I'd join, but I'm only here to provide witty refusals.",
      "I'm actually terrible at that, unless you need an example of how not to do it.",
      "You deserve someone who will say yes without giving three excuses first.",
      "My track record suggests I should sit this one out.",
      "I'm the wrong person for the job; I'm the right person for saying no.",
      "If you need someone to sabotage it, I'd be perfect. Otherwise, I'll pass.",
      "The fortune cookie said 'No' just last night.",
      "The prophecy foretold I would decline this.",
      "My tarot cards all just collectively sighed.",
      "I checked my crystal ball, and it said 'nah'.",
      "The spirit world recommends I stay home.",
      "I threw some runes and they spelled out N-O.",
      "My magic 8-ball said 'Outlook not so good'.",
      "I was reading tea leaves and they said to avoid this at all costs.",
      "A psychic warned me about requests like these.",
      "I'm in a committed relationship with my bed at that time.",
      "Sleep and I have a standing date, can't break it.",
      "I would, but I'm trying this new thing called sleeping.",
      "I already took a melatonin. It's lights out for me.",
      "I'm saving all my energy to blink and breathe.",
      "I have an early morning of sleeping in.",
      "If it's not a nap, I'm not interested.",
      "I can't; my pillow needs me.",
      "Count me out, I'm counting sheep instead.",
      "I'll be in the middle of my power nap (which might last all day).",
      "Disclaimer: Any agreement on my part is void where fun is prohibited.",
      "Fine print: My 'yes' comes with 0% enthusiasm.",
      "I checked the terms and conditions of my life, and it says 'nope'.",
      "By agreeing, I might violate several personal bylaws.",
      "According to the unwritten rules I just wrote, I must decline.",
      "My user agreement strictly prohibits me from doing that.",
      "I would violate the Geneva Convention of Introverts if I agreed.",
      "I ran this request through my internal compliance, and it failed.",
      "My lawyer (who is imaginary) advises against it.",
      "The contract I signed with my bed doesn't allow me to do anything else.",
      "My plate is full, and I already ate the portion of doing favors.",
      "I'm overbooked, overwhelmed, and overjoyed to say no.",
      "My schedule spontaneously combusted from too many tasks.",
      "I'm currently managing too many crises\u2014adding another might cause a meltdown.",
      "I have too much on my plate, and I'm on a no-carb diet (no extra tasks).",
      "I'm drowning in tasks, and I didn't bring a snorkel.",
      "I would, but I'm already in over my head with other regrets.",
      "My to-do list and I aren't on speaking terms, it's so long.",
      "I'm way too popular with tasks I haven't done yet.",
      "The hamster running my life wheel is on strike due to overwork.",
      "'No' is just 'on' spelled backwards, and I'm off.",
      "Spell check suggests I say N-O.",
      "I wrote you a poem: Roses are red, violets are blue, my answer is no, no can do.",
      "The only thing I'm inclined to say is a decline.",
      "Let me put it in a language you understand: No.",
      "I'm fluent in 5 languages, and in all of them, the answer is no.",
      "'Yes' and I aren't on speaking terms at the moment.",
      "I would respond with a fancy Latin phrase for no, but plain 'no' will suffice.",
      "As an acronym, my answer is N.O.",
      "If you rearrange the letters of 'yes', you get 'sye'\u2014which is exactly how much sense it would make for me to do this.",
      "I'm booked until the heat death of the universe.",
      "My calendar is filled up through the next century, sorry.",
      "I have a scheduling conflict with the rest of my life.",
      "I'm not free until the sun rises in the west and sets in the east.",
      "Check back with me in a million years, I might have time then.",
      "I'm on hold with life right now; expect a long wait.",
      "My availability is currently in a state of quantum uncertainty, leaning towards no.",
      "I've pre-booked my next thousand refusals; you're just one of them.",
      "My schedule is tighter than my jeans after the holidays.",
      "I looked at my calendar, and it laughed at me for even asking.",
      "Thank you for thinking of me, but I'm going to decline hilariously.",
      "I appreciate the offer, but I'll have to decline, mainly out of laziness.",
      "Much obliged that you asked, but no can do, buckaroo.",
      "I'm honored you thought of me, but I must respectfully and comically decline.",
      "Please accept my sincerest apologies as I laugh and say no.",
      "Regretfully, I'll have to pass, but I'll do it with a smile.",
      "It's not you, it's me. I'm just allergic to doing things.",
      "Respectfully, I'm going to ghost this opportunity.",
      "I'm truly touched you asked. Truly. Still no, though.",
      "With all due respect, no way, Jos\xE9.",
      "I forgot how to say yes.",
      "I have short-term memory loss when it comes to responsibilities.",
      "I'd agree, but I just forgot what you asked, so... no.",
      "My brain auto-deletes requests like that.",
      "I've got selective amnesia for favors.",
      "I was going to help, but I forgot to care.",
      "I'm sorry, I suffer from CRS (Can't Remember Saying yes).",
      "I can't remember the last time I said yes, and I won't start now.",
      "What was that? Did you ask something? No? Great.",
      "I put your request in my mental shredder.",
      "I can't; I'm busy teaching my goldfish to play fetch for charity.",
      "I'm devoting that time slot to contemplating the meaning of life. It's a charity case really.",
      "I've donated all my free time to non-doing causes.",
      "I'm working on a petition to ban requests like this.",
      "My calendar is filled with volunteer work at the Society of Professional Naysayers.",
      "I'm training for a charity event: a marathon of saying no.",
      "I'm raising awareness for the endangered word 'no' by using it frequently.",
      "I auctioned off my time slot for that day to the highest bidder of nothing.",
      "I'm doing a silent retreat away from responsibilities.",
      "I gave all my free time to someone else; I'm running a deficit.",
      "I'm on a strict no-social-interaction diet.",
      "I have to cancel; I've exceeded my people-ing quota for the week.",
      "I'm introverting so hard right now, I can't stop to do that.",
      "My social battery is at 0%, and my charger is missing.",
      "I'm away on an introvert adventure (indoors, alone).",
      "I can't come out; I've recently taken up hermit life.",
      "Socializing is off the table, literally, I flipped the table.",
      "I'm allergic to crowds, and even one person counts sometimes.",
      "I'm practicing social distancing... from everyone.",
      "Public me is out of office; please contact me never.",
      "I accidentally glued myself to the couch.",
      "My legs have filed a complaint about excessive walking.",
      "My get-up-and-go got up and went without me.",
      "I'm having an out-of-body experience and I'm not back yet.",
      "My energy and I are currently in a long-distance relationship.",
      "I woke up with a serious case of gravity today; can't get up.",
      "I have an acute case of Couch Magnetism.",
      "My limbs have gone on strike until further notice.",
      "I'm feeling as active as a sloth on vacation.",
      "I'm under house arrest by my own laziness.",
      "I'd rather bathe in week-old soup than do that.",
      "I prefer to juggle chainsaws blindfolded\u2014seems safer than saying yes.",
      "I would climb Mount Everest barefoot before I'd agree to that.",
      "I'd rather be the sole target in a paintball match than participate.",
      "Honestly, chewing glass sounds more fun than saying yes to this.",
      "I'd rather do my own dental surgery with no anesthesia.",
      "Saying yes? I'd sooner challenge a kangaroo to a boxing match.",
      "I'd rather walk on Lego bricks for an hour straight.",
      "I prefer the thrill of not doing it, thanks.",
      "I'd accept, but I have a strict policy of not walking into obvious traps.",
      "I would, but my bank account said I can't afford the gas to get there.",
      "Unless there's a cash prize for me, I'll have to decline.",
      "I only work on commission, and this request doesn't pay in pizza.",
      "If you pay me in gold bars, I'll reconsider. Otherwise, no.",
      "My accountant advised me that saying yes doesn't balance my books.",
      "I'm waiting for a rich benefactor to fund my yeses.",
      "I can't fit that into my budget of time and energy.",
      "I'm in a bit of a financial bind: low on funds and on yeses.",
      "Unless I get stock options for this, I'm out.",
      "I require a down payment just to think about saying yes.",
      "I'm waiting for a sign from the universe... oh, there it is: it says no.",
      "I need to conserve my remaining brain cell.",
      "My existential dread and I have plans.",
      "I'm on strike until further notice, and I'm the union leader.",
      "I've got a hot date with a pizza and a TV show.",
      "I'm currently observing National No Day, it's a personal holiday.",
      "I have a policy to not leap into volcanoes, and this feels similarly dangerous.",
      "Can't come, I've made other plans with my bed and pillow.",
      "I must decline, for science!",
      "I'm trying to see how long I can go without doing anything productive.",
      "My mom said I have to stay home and, um, alphabetize the pantry.",
      "My family booked me for a game of hide-and-seek and I'm the missing piece.",
      "My kids grounded me for trying to have a life.",
      "I can't; my ancestors' spirits would be displeased if I did.",
      "My dog will only let me out of the house if it's for walks, not work.",
      "My spouse already made dinner plans with me and Netflix.",
      "It's family night and by family, I mean me and my snacks.",
      "I have to attend a family tradition of doing nothing tonight.",
      "My cat is giving me the 'don't you dare go out' look.",
      "My goldfish family reunion is happening in my fish tank.",
      "NO is just YES suffering from oppositional defiant disorder.",
      "N-O: two letters that, when combined, describe my plans perfectly.",
      "I'm going to turn that invitation into an inviti-NOPE.",
      "'No' is my spirit animal.",
      "I can't spell 'nope' without N-O.",
      "They say double negatives make a positive, but my single negative stands firm.",
      "I'm consonantly refusing and vowel-ing out of this one.",
      "Just in case you missed it: N as in No, O as in Oh-no-not-today.",
      "My motto is 'Just say no', and I'm very loyal to my motto.",
      "I signed up for a course on saying no, and I'm just practicing my homework.",
      "I prefer to watch the grass grow at that time, sorry.",
      "Actually, I was planning to count sand grains, which sounds more fun.",
      "I've been looking forward to reorganizing my button collection instead.",
      "I scheduled some quality time with my ceiling fan.",
      "I have a thrilling date with doing absolutely nothing.",
      "I'm engaged in a passionate affair with free time, and I can't cheat on it.",
      "I have front row seats to my couch and I intend to use them.",
      "There's a rerun of a show I've never seen that I just can't miss.",
      "I already promised to spend that time twiddling my thumbs.",
      "I have to decline; I wouldn't want to outshine everyone with my presence.",
      "My greatness is just too much for that event to handle.",
      "I'd say yes, but then it wouldn't be fair to the others when I excel effortlessly.",
      "I can't make it; the paparazzi might swarm your event if I do.",
      "I'm doing you a favor by not coming and stealing the spotlight.",
      "I would attend, but I'm kind of a big deal in my own mirror.",
      "I'm too cool for that (and by too cool, I mean too lazy).",
      "Allow me to gracefully decline, so you can have fun without my overwhelming awesomeness.",
      "I'll have to decline; I'm too busy being fabulous elsewhere.",
      "I must humbly decline because my perfection is exhausting.",
      "I have to return the One Ring to Mordor that day.",
      "Sorry, I'm scheduled to fight Darth Vader then.",
      "I need to sit by the phone in case Hogwarts calls.",
      "I would but I've already volunteered as tribute elsewhere.",
      "My Bat-Signal just lit up, gotta go save Gotham instead.",
      "I can't\u2014my flux capacitor is on the fritz and I can't make it in time.",
      "That night is my scheduled trip back to the future.",
      "Zombies may attack if I leave the house, I saw it in a documentary (okay, it was a zombie movie).",
      "I'm busy negotiating with some minions; world domination can't wait.",
      "I have to consult Doctor Strange about attending (he foresaw that I don't).",
      "My boss told me to only say yes to salary raises, so no to everything else.",
      "I've used up all my sick days, so I'm calling in well and staying home.",
      "My teacher said I need to focus on not overcommitting.",
      "I have a work thing... it's called avoiding work.",
      "My calendar at work has a big red 'NOPE' on that date.",
      "I can't, I have an important meeting to stare at a spreadsheet and contemplate life.",
      "I'm taking a personal day to avoid persons.",
      "Got a conference call with myself, and it's very time-consuming.",
      "My overtime got into a fight with my free time, and free time lost.",
      "My PTO (Permission To Opt-out) is in effect.",
      "If I go, it might trigger the apocalypse. Better not risk it.",
      "I have to stay put to prevent the zombie outbreak from starting (long story).",
      "I'd come, but Nostradamus predicted I'd say no.",
      "It's one of the signs of the apocalypse if I say yes, let's avoid that.",
      "My attendance is the last seal before the apocalypse, so hard pass.",
      "I fear my yes would summon Cthulhu or something.",
      "I'm avoiding causing a butterfly effect that ends the world.",
      "Legend says if I ever agree, the world will end in a spectacular musical number.",
      "I made a deal with a demon to never say yes, and I hate to break a contract.",
      "The doomsday clock ticks faster every time I consider agreeing.",
      "Yes, you may interpret my silence as a no.",
      "I\u2019m nodding yes in spirit, but physically I\u2019m shaking my head no.",
      "Sure...ly you can find someone else?",
      "Yes is in my vocabulary, just not today.",
      "On a scale of yes to no, I'm at a 'not in a million years'.",
      "I meant to say yes, but all that came out was no.",
      "Consider my 'yes' lost in the mail.",
      "Y-E-S are letters you'll not hear from me today.",
      "Picture me enthusiastically not doing that.",
      "Imagining me helping? Now imagine the opposite. There you go.",
      "I'm feeling unlucky, so I better not risk saying yes.",
      "I rolled the dice and it came up 'no'.",
      "I consulted Lady Luck; she told me to stay home.",
      "My luck ran out just before you asked.",
      "If I had a lucky penny for every time I said no, I'd be rich. Speaking of which, no.",
      "I'd join but I accidentally walked under a ladder and broke a mirror. Not chancing it.",
      "My fortune teller said 'not in your stars', I trust that.",
      "I pulled a card from a deck; it said 'Do Not Pass Go, Do Not Say Yes'.",
      "Fate decided to swipe left on this one.",
      "The stars aligned... to form a big 'NO'.",
      "I can't; the weather forecast said there's a 100% chance of me staying home.",
      "It's raining 'no's and I'm soaking wet in them.",
      "I only go out in perfect weather conditions, which this clearly isn't (for me).",
      "I'm experiencing a heavy downpour of laziness.",
      "The winds of fate blew and I got hit in the face with a 'no'.",
      "There\u2019s a storm brewing and it's named My Reluctance.",
      "I suspect a sudden tornado of responsibilities will keep me inside.",
      "I'm under the weather, specifically a cloud of nope.",
      "The forecast for that day is me with a high chance of not showing up.",
      "I\u2019d hate to step out and melt; I'm made of sugar and sarcasm.",
      "I could say yes, but that would be a lie.",
      "My heart says yes, but my soul says 'are you kidding?'",
      "I'm physically capable of doing it, just morally opposed (to effort).",
      "I have an inner conflict: Part of me says 'no'. The other part also says 'no'.",
      "I\u2019ve reached an age where I just say no to things I hate. And I hate this.",
      "My willpower to do that got stuck in traffic and won't make it.",
      "I gave it some thought. The thought was 'no'.",
      "In theory I could, but let's stick to reality where I won't.",
      "I'm trying to be less of a people-pleaser, starting now.",
      "I just looked in the mirror and practiced saying 'no' and it felt right.",
      "I can't say yes before I've had my coffee. And I never plan to have coffee.",
      "No caffeine, no can-do.",
      "My coffee and I have a pact: no important decisions without it, and it\u2019s not available.",
      "I would say yes, but I haven't met my daily coffee quota to deal with the consequences.",
      "I'm in a decaffeinated state of no.",
      "My brain is only powered by caffeine, and we're experiencing a power outage.",
      "No java, no java-do.",
      "The coffee machine called in sick, so I'm incapable of agreeing to anything.",
      "I promised myself I'd only decide things after coffee; too bad it's already no-o'clock.",
      "My morning coffee and I decided this isn't worth the caffeine it would take.",
      "I'm too busy plotting world domination to attend.",
      "If I said yes, it might ruin my evil plan.",
      "My secret lair needs tending to at that time.",
      "I'm in the middle of a devious scheme and can't break away.",
      "I can't help you; I'm a supervillain in training and this would mess up my cred.",
      "I would join, but then I'd have to recruit you into my plans and you wouldn't like that.",
      "I'm brainstorming how to take over the world, and I need full concentration.",
      "My minions scheduled a revolt for that day, and I need to be present.",
      "I must regretfully decline as I have many diabolical laughs to practice.",
      "Evil never sleeps, and apparently neither do I, except I'm definitely not going out.",
      "I'm trying to align my chakras by not stressing, so I'll say no.",
      "To maintain balance in the Force, I must decline.",
      "My yin and yang are telling me not to do it.",
      "For the sake of cosmic balance, I can't agree.",
      "I'm in the middle of a feng shui adjustment to my life that forbids new commitments.",
      "I must refuse, or the delicate equilibrium of my laziness will be disrupted.",
      "Saying yes would throw off the balance of my weekly yes-to-no ratio.",
      "I need to keep my karma clear, and I sense a yes would muddy it.",
      "I must achieve inner peace, which means not complicating my day with this.",
      "I'm afraid if I enjoy myself, it will become a bad habit.",
      "If I end up liking it, then I'll have to do it again, so no.",
      "I'm scared of success, so I must decline anything that might work out.",
      "I'm afraid I'll set the bar too high if I say yes and do a good job.",
      "Fun? I'm not sure I remember what that is, better not risk it.",
      "I'm allergic to fun\u2014break out in sarcasm.",
      "I avoid anything that might make me smile too much.",
      "I'm trying to remain mysterious and saying yes would make me too accessible.",
      "I like to keep my expectations low by not doing anything.",
      "I'm avoiding fun until further notice.",
      "Asking me to do that is like asking a fish to climb a tree.",
      "Me doing that would be like a chicken trying to do algebra.",
      "Saying yes would be as unusual as a cat becoming a vegan.",
      "That idea and I go together like oil and water.",
      "Me participating is like a square peg in a round hole\u2014just not fitting.",
      "My motivation and that task are like two magnets repelling each other.",
      "It would be like expecting a sloth to win a 100m dash.",
      "As compatible as ice cream and hot soup\u2014best kept separate.",
      "Me saying yes is about as likely as pigs piloting a spaceship.",
      "That request is the peanut butter to my allergy.",
      "I just realized it's a holiday: National Not Gonna Do It Day.",
      "I'm observing a personal holiday called Nope-vember.",
      "I can't; I've got Festivus grievances to air that day.",
      "I'm booked that day celebrating the Festival of No.",
      "I'm already committed to the Anti-Work Holiday.",
      "I celebrate Opposite Day by doing the opposite of what you ask.",
      "Sorry, it's my annual day of rest... like the Sabbath, but for laziness.",
      "I only celebrate events that involve cake, so unless there's cake, no.",
      "That date conflicts with my extended celebration of Chillmas.",
      "It's my pet rock's birthday, which is basically a global holiday to me.",
      "I want to say yes, but my common sense is yelling 'no' repeatedly.",
      "My heart says maybe, but my brain threw a giant red flag.",
      "My gut feeling started doing the Macarena when you asked (that's a no dance).",
      "Every fiber of my being is currently doing the wave in honor of saying no.",
      "The tiny responsible voice in my head and the loud lazy one both agree: no.",
      "I asked my better judgment, and it laughed hysterically.",
      "My brain highlighted that request and hit the delete key.",
      "My conscience would haunt me if I said yes.",
      "Even the angel on my shoulder is like, 'nah, dude'.",
      "My inner voice is just screaming 'NOOOO' Darth Vader-style.",
      "I'm not procrastinating; I'm proactively saying no in advance.",
      "I'm delaying my decision until the end of time\u2014spoiler: it's no.",
      "Why do today what I can avoid indefinitely?",
      "My planner just says 'Nope' on every page this week.",
      "I'll put this request on my to-do list right after 'learn teleportation'.",
      "I'm in the process of rescheduling my procrastination for later.",
      "I'm waiting for the last minute, and it hasn't arrived for this.",
      "I thought about doing it later, then realized later is fully booked as well.",
      "I'm on a procrastination roll, can't stop now.",
      "I'm deferring my yes until a year that doesn't exist.",
      "I would help, but then you'd have two of us needing help.",
      "I'm not sure you can afford the damage I'd do by trying.",
      "My help comes with a money-back guarantee, but you don't want it.",
      "I'm the last person who should do that\u2014literally, I'm last in line.",
      "I tried doing something similar once; let's just say the fire department got involved.",
      "If I do it, you'll spend more time fixing my mistakes.",
      "My competence is on vacation right now.",
      "I excel at procrastinating, not at actually doing things.",
      "I'd volunteer, but the incompetence fee I charge is quite high.",
      "I would assist, but then I'd have to legally disclaim any results.",
      "It doesn't really spark joy in me, so I'll pass.",
      "That idea doesn't pass the vibe check for me.",
      "I'm not feeling a strong gravitational pull towards doing that.",
      "My interest level is somewhere between zero and negative.",
      "If I had any less interest, I'd be in a coma.",
      "My curiosity just left the room when I heard that idea.",
      "I'm sure it's fascinating, but my attention span thinks otherwise.",
      "I'm saving my enthusiasm for something duller.",
      "I fell asleep halfway through considering it.",
      "I tried to get excited about it and pulled a muscle.",
      "The government has me in a witness protection program against events like this.",
      "My parole officer said I'm only allowed to work on being lazy.",
      "The FBI called; they said me saying yes would be a national security risk.",
      "I would come, but the judge of my life sentenced me to staying home.",
      "My license to have fun was revoked.",
      "I'd love to comply, but I'm under strict orders from myself not to.",
      "The Queen of England ghost-told me to stay home (I only take royal commands).",
      "The island I'm exiled on doesn't allow me to leave for events.",
      "I'm contractually obligated to decline under the terms of my life choices.",
      "The police told me I'm too interesting to attend normal gatherings.",
      "I'm too old for this kind of commitment to things.",
      "I think I'm at an age where I just say no to stuff like this.",
      "At my age, my give-a-darn is busted.",
      "I'm having a midlife crisis and saying yes isn't part of it.",
      "I'm in my rebellious phase of only doing what I want, so no.",
      "I'm channeling my inner grumpy old person and staying home.",
      "I'm revisiting my teenage rebellion by saying no to everything.",
      "In my day, we didn't have to do things we didn't want to (and I'm keeping it that way).",
      "I'm practicing for my future as a crotchety old hermit.",
      "I'm aging like fine wine, which means getting more stubborn about saying no.",
      "My fairy godmother said I should stay home or I'll turn into a pumpkin.",
      "Cinderella left one shoe here and I need to help find the other instead of going out.",
      "I'm awaiting Prince Charming with pizza, so I can't go anywhere.",
      "I can't come; the Big Bad Wolf is at my door (selling insurance, apparently).",
      "I have to keep an eye on my gingerbread house, you know how it is.",
      "The seven dwarves warned me about overextending myself.",
      "I'm under a sleeping spell that only time (and not doing that) can break.",
      "I lost my glass slipper and can't go out without proper footwear.",
      "The frog I was supposed to kiss to become a prince gave me a rain check.",
      "I'm stuck in a fairy tale, and agreeing to that isn't part of the plot.",
      "I have to guard the refrigerator tonight; snacks are counting on me.",
      "I've dedicated that time to an ice cream in need of company.",
      "I'm carb loading for a marathon of not doing that.",
      "I have a dinner date with a pizza and it would be jealous if I cancel.",
      "I can't go out; my fridge just opened a bottle of wine and it'd be rude not to join.",
      "I'm testing a theory that I can survive on chips alone, can't interrupt that.",
      "My oven and I have plans to bake and eat an entire cake.",
      "I promised to help my popcorn pop\u2014it's a very involved process.",
      "I would, but I just started cooking a five-course meal for one (me).",
      "I'm learning to cook invisible meals; it's very time-consuming.",
      "I have to be on standby in case Netflix needs me to watch something.",
      "I'm on call as the family couch potato.",
      "I'm the designated stay-at-home person this week.",
      "I'm serving jury duty in the court of my own laziness.",
      "I'm on a secret standby mission \u2013 can't disclose, just know I can't come.",
      "I'm the emergency contact for my TV, so I must remain available.",
      "I'm committed to staying home in case of a snack emergency.",
      "I signed up to be a test subject for sleeping in, and I have a session then.",
      "I'm part of a top-secret project called Project No.",
      "I have a duty to uphold: keep my couch from feeling lonely.",
      "My car decided to take a personal day off.",
      "The public transportation in my living room is currently not operational.",
      "I tried to leave, but my door wouldn't let me (we negotiated, and I stayed).",
      "My GPS recommended I stay home to avoid bad decisions.",
      "My carpool pony is sick. Yes, it's a pony, don't ask.",
      "I would bike there, but my bike just laughed at me.",
      "Uber doesn't deliver me to bad ideas.",
      "I missed the train of thought that would make me go.",
      "My broomstick is in the shop (you know how unreliable those are).",
      "All roads lead to me staying home.",
      "My insurance doesn't cover acts of me doing that.",
      "I need to stay in a safe environment, and that event sounds risky (to my sanity).",
      "Occupational Health and Safety flagged that activity as a hazard for me.",
      "I'm waiting for my bubble wrap suit to arrive before I attempt such things.",
      "That sounds dangerous for my well-being (mostly my mental well-being).",
      "I only operate heavy machinery (like my couch) under supervision, so I can't go.",
      "The last time I tried, I got a papercut on my soul.",
      "For safety reasons, I'm required to stay away from that kind of excitement.",
      "My guardian angel submitted a restraining order against that plan.",
      "I'd prefer not to injure my will to live by saying yes.",
      "I've transcended the need for activities like that.",
      "I'm focusing on the journey of doing nothing, not the destination of that task.",
      "My existential crisis and I decided against it.",
      "In the grand tapestry of life, I'm the thread that sits this one out.",
      "I've realized the meaning of life isn't doing that, so I'm good.",
      "I'd rather search for the purpose of life than attend.",
      "I think, therefore I am... not going to do that.",
      "My current philosophy: if it requires pants, it's a no.",
      "I'm practicing wu wei (doing nothing) as per Taoism, so I must decline.",
      "To do or not to do? That is the question, and I've answered 'not to do.'",
      "I trained for years under a master of saying no.",
      "I got a black belt in No-jitsu.",
      "I've been preparing my whole life to say no to this exact request.",
      "I took a seminar on assertiveness and I'm itching to use what I learned: No.",
      "My reflexes are honed to automatically decline invites.",
      "I signed up for a 'Just Say No' workshop and I need to practice.",
      "I'm part of a secret society where we only communicate via refusals.",
      "My knee-jerk reaction is no, and my knee is feeling particularly jerky.",
      "Saying no is my cardio.",
      "I've been rehearsing my 'no' all week for just such an occasion.",
      "No is my middle name. Well, not legally, but spiritually.",
      "I come from a long line of expert decliners.",
      "My DNA test came back: I'm 100% not doing that.",
      "I'm genetically predisposed to say no.",
      "I was born to say no\u2014first word I ever said and never stopped.",
      "I have a rare genetic disorder where I break out in refusals.",
      "My spirit animal is a sloth, and it's telling me to stay put.",
      "Astrologically, I'm a No-rgo or a Libra-thinks-not (one of those).",
      "I took an oath as a kid to avoid anything resembling this.",
      "My life coach advised me to eliminate stressors, starting with this.",
      "My friends would have a heart attack if I suddenly said yes to things.",
      "It would set a bad precedent if I started agreeing to reasonable requests.",
      "If I start saying yes now, where will it end? World domination? Better not.",
      "Saying yes once might give me a reputation for being helpful\u2014can't have that.",
      "I can't shock my system with responsibility like that; doctor\u2019s orders.",
      "Yes is such a small word for such a life-changing event, I'm not ready.",
      "I'm afraid saying yes now will open floodgates of expectations.",
      "If I said yes, people might expect me to do it again. Perish the thought.",
      "Agreeing to this would confuse everyone who knows me as a professional avoider.",
      "My brand is 'reliable disappointment', and I have to stay consistent.",
      "Can I take a rain check and then lose it forever?",
      "Let's pencil it in for the 12th of Never.",
      "I'll join you on the 32nd of this month.",
      "How about I catch the next one... in a parallel universe?",
      "Maybe another time, like when pigs fly or hell freezes over, whichever comes first.",
      "I'll attend in spirit. Specifically, the spirit of 'not there'.",
      "Let's say I was there in our imaginations and call it a day.",
      "I'm there in thought, just not in body or actual presence.",
      "I'll let you know when I'm free. (Don't wait up.)",
      "I'm on a mission in a video game and real life can't compete.",
      "I would, but I'm one XP away from leveling up in doing nothing.",
      "My guild in World of Warcraft needs me to farm 'No' potions.",
      "I'm in the middle of a high-stakes Tetris game (yes, it's very serious).",
      "I promised my online friends I'd keep the server alive by staying on.",
      "I'm practicing my gaming skills; real life quests have to wait.",
      "I have to defend my virtual village from pixelated invaders at that time.",
      "My controller died, and so did my desire to go out.",
      "I'm roleplaying as a recluse currently.",
      "I'm busy achieving a new high score in introversion.",
      "I have nothing to wear that would match the look of regret I'd have if I went.",
      "All my clothes are allergic to outside activities.",
      "My wardrobe and I have an agreement: it only sees the couch.",
      "I would go, but I've already changed into my pajamas.",
      "I can't find my motivation to get dressed up; I think I donated it.",
      "The dress code for that sounds like 'effort', so I'm out.",
      "I only attend events that allow pajamas as formal attire.",
      "My fashion sense just texted: it said not to bother.",
      "I'm stuck in my closet's Narnia and can't get out to attend.",
      "Sorry, nothing in my closet screams 'let\u2019s do this.' It all screams 'stay home'.",
      "My dog ate my homework, and then demanded a sequel.",
      "I was late because time decided to move faster than me today.",
      "I missed work because my bedroom was conducting a hostage situation with me as the hostage.",
      "I didn't show up because I prefer to be fashionably absent.",
      "My alarm clock and I had a fight, and it won by not ringing.",
      "I skipped class because I felt I owed it to myself to not learn bad things.",
      "I couldn't join because I was busy not panicking about it.",
      "I didn't attend the meeting because I was abducted by a daydream.",
      "I bailed last minute because commitment issues run in my family.",
      "I arrived on time in spirit, but my body took a detour.",
      "Does a fish need a bicycle? That's how much I need to do this.",
      "Do pigs fly? Only then would I do that.",
      "Is the sky green? No? There's my answer.",
      "Would it be wise for me to agree? That's a no from the Council of Me.",
      "Is this the part where I say yes? No? Good, because I won't.",
      "Do I look like someone who would do that? Correct, I don't.",
      "Is it Opposite Day? Because otherwise my answer is no.",
      "Did I just hear myself volunteer? No, so I'll keep it that way.",
      "Is this a trick question? Because I'm answering like it's one: no.",
      "Am I coming? I'll answer that when water isn't wet.",
      "I'm going to deliver my answer in interpretive dance. *performs a NO*",
      "If I could sing, I'd sing 'I say noooo' in opera for you.",
      "Imagine me dramatically yelling 'I decline!' with a cape flourish.",
      "I'll write a haiku for my answer: 'No absolutely / Indubitably no / Still no, sorry'.",
      "Picture a skywriter writing 'NO' above your house\u2014that's my answer.",
      "Insert an orchestra sound: dun dun dun NO.",
      "I'm throwing confetti and the confetti spells 'NO'.",
      "I'm holding up a scorecard that says 0, as in 0% chance.",
      "Improv theater time: I play a person who says no. End scene.",
      "*Cue dramatic exit with a refusal monologue*.",
      "I would, but I'm Batman. (That excuse works for anything, right?)",
      "I was abducted by aliens yesterday and they gave me strict instructions to avoid that.",
      "Aliens invited me to a galaxy party, and I already RSVP'd yes to them.",
      "I'm communicating with extraterrestrials at that time, Earth events must wait.",
      "I'm on a mission to Mars in my dreams, scheduling conflict with reality.",
      "I can't come; I'm the aliens' tour guide for Earth and they're very demanding.",
      "The mothership is coming to pick me up any minute now.",
      "I'm learning an alien language; they don't have a word for yes and neither do I right now.",
      "The aliens took my enthusiasm with them when they left.",
      "I suspect I'm an alien, and we historically avoid those situations.",
      "My planet needs me, so I must go (meaning I must stay at home).",
      "I'm running for President of the Procrastination Club; my campaign is very time-consuming.",
      "My will to participate mysteriously vanished just as you asked.",
      "I played the lottery of caring and lost.",
      "I have an irrational fear of accidentally enjoying obligations, so I avoid them.",
      "As the meme goes, ain't nobody got time for that.",
      "I'm too deep into my comfort zone to even see the exit.",
      "I've reached my nope limit for the day.",
      "My calendar just sent me a restraining order against new events.",
      "I'm in a long-term relationship with canceling plans.",
      "I'm experiencing JOMO (Joy Of Missing Out) for this event.",
      "Channeling Opposite Nike: 'Just don't do it.'",
      "I'd rather regret not doing it than regret doing it.",
      "Applying my version of Murphy's Law: if it can be avoided, it will be.",
      "My answer is like Schr\xF6dinger's cat: it's both yes and no until you realize it's just no.",
      "YOLO, which is why I'm saying no \u2013 I value my one life too much.",
      "My horoscope app just notified me: 'Today is a good day to say no.'",
      "If saying no were an Olympic sport, I'd have a gold medal.",
      "I wear my refusal as a badge of honor.",
      "I'm going to have to decline faster than a cheetah on energy drinks.",
      "I would say yes, but then I'd have to wake up from my daydream, and reality is far less pleasant.",
      "Emergency! I just ran out of chocolate, and that's all I can handle right now.",
      "Fate just slid into my DMs with a big fat 'no'.",
      "My brain is at full capacity with useless information, there's no room for new tasks.",
      "If I help you, I'd feel proud of myself, and I can't handle that much emotion.",
      "I'll give you two choices: no, or nope. You can pick.",
      "Let's make it multiple choice. I choose option (D) - Not gonna happen.",
      "Look on the bright side: at least I'm consistent in saying no.",
      "Consider this a 'no' served with a side of sarcasm.",
      "I'm stuck in a black hole of procrastination and can't escape in time to do that.",
      "I only say yes during solar eclipses, and there's none scheduled.",
      "My retro soul can't handle modern tasks like that.",
      "The word 'yes' gives me hives; I'm avoiding an allergic reaction.",
      "I had a dream I said yes; I woke up in a cold sweat. Not doing that in reality.",
      "In the time it took you to ask, I already decided no.",
      "I'm sorry, I can't hear you over the sound of me not doing that.",
      "I think our connection is bad. If you asked me to do something, the answer is static... which means no.",
      "I misheard you, I thought you said 'do you want a taco'. Since you didn't, I'm not interested.",
      "My phone auto-corrected your request to 'no', weird right?",
      "I got your message, but unfortunately, my spam filter caught it under 'unwanted tasks'.",
      "I believe you have the wrong number; the person who says yes isn't available.",
      "I speak fluent sarcasm, so my interpretation of your question is a hard no.",
      "Let me put you on hold... *never takes off hold*",
      "I didn\u2019t receive the memo that I was supposed to care.",
      "I'm experiencing some technical difficulties in giving a darn.",
      "The gods of procrastination demand I sacrifice this task by not doing it.",
      "No is a complete sentence, and it's my final answer.",
      "I fear agreeing could somehow trigger a zombie apocalypse, so I'm playing it safe.",
      "My spidey-sense is tingling, and it's telling me not to do this.",
      "The fabric of my being just isn't woven for that request.",
      "They say 'follow your dreams' \u2014 and my dream is to not do that.",
      "I'm just following the saying 'do what you love' \u2014 and I love saying no.",
      "Not today, Satan. Actually, not any day.",
      "My procrastination is doing a fantastic job; I wouldn't want to interrupt its flow.",
      "No means 'New Opportunities'... for me to stay at home.",
      "I made a bet that I could say no to everything for a week. I'm about to win.",
      "I'm conducting a social experiment where I say no and observe what happens.",
      "One of my pet peeves is doing stuff, so I simply don't.",
      "Life is short, and I choose to waste it my way, not on that.",
      "I've already met my quota of bad decisions for the month; saying yes would exceed it.",
      "I'd love to participate, but I'm dead inside, so I just can't.",
      "I have main character syndrome, and my story arc doesn't involve doing that.",
      "Think of me as the final boss of saying no \u2013 undefeated.",
      "Time is a non-renewable resource, and I choose not to spend any on that.",
      "My free trial of doing things has expired, and I can't afford the subscription.",
      "I'm on a strict 'no commitments' diet.",
      "I'm doing intermittent fasting from responsibilities; today's a fasting day.",
      "I only say yes on leap days, and today isn't one.",
      "I can't risk unlocking my final form by being helpful.",
      "I need to maintain my air of mystery by not showing up.",
      "I can't let people find out I actually have free time.",
      "I used all my willpower just getting out of bed this morning.",
      "My life is a choose-your-own-adventure, and I flipped to the page where I say no.",
      "By the power vested in me, I'm officially saying no.",
      "Me, myself, and I had a meeting; we unanimously decided to decline.",
      "I see your request and raise you a 'no'.",
      "My enthusiasm is on backorder, and the delivery date keeps getting pushed.",
      "I'm still recovering from the last time I said yes.",
      "I used to do things like that, then I took an arrow to the knee.",
      "It's not procrastination if I never planned on doing it.",
      "I didn't choose the no life; the no life chose me.",
      "Effort is currently not supported by my operating system.",
      "My personal assistant (who's imaginary) already declined for me.",
      "I prefer to remain an out-of-office message in human form.",
      "I got lost on the way to 'yes' and ended up at 'no'.",
      "If I say yes, then I'd actually have to do it\u2014let's avoid that.",
      "In the hero's journey of my life, I'm at the 'refusal of the call' stage.",
      "I'm on a sabbatical from anything that sounds like work.",
      "I made a New Year's resolution to say no more often. Starting now.",
      "I performed a risk assessment and the results said 'no'.",
      "I have a reputation to uphold\u2014specifically, for saying no.",
      "My intuition tells me this isn't the day I start being helpful.",
      "The thought of doing that gave me a phantom backache. I'll pass.",
      "If I had a nickel for every time I said no, I'd have a lot of nickels.",
      "I'm attending a meeting of the Anti-Social Social Club (I'm the only member).",
      "My brain's hard drive is full; there's no room for that task.",
      "I would come, but I'm trying this new thing where I just don't.",
      "I regret to inform you that I'll be vigorously not doing that.",
      "I'm living vicariously through others who say yes, so I don't have to.",
      "Mirror, mirror on the wall, should I do it? It said, 'Not at all.'",
      "I can't say yes; it would jeopardize my standing in the Procrastinators Hall of Fame.",
      "The probability of me doing that is approaching absolute zero.",
      "My commitment to doing nothing would get jealous if I did something else.",
      "My core competency is avoiding things, and I really need to focus on it.",
      "I lack the necessary enthusiasm to even pretend to consider that.",
      "I'm more of an 'observe from afar' person than a 'participate' person.",
      "My brain is like a parrot that only knows one word: 'no'.",
      "I'm writing a book called '101 Ways to Say No' \u2013 thanks for the material.",
      "I'm a terrible liar, so I won't pretend I want to do that.",
      "'No.' I'm giving that answer five stars.",
      "'No' \u2014 from me, with love.",
      "May the 'no' be with you.",
      "Saying no is my superpower, and I'm using it to save my free time.",
      "I felt burnout just hearing about it, so I'm preemptively declining.",
      "I'm following the principle of least effort, which means I have to decline.",
      "My life is like a sitcom about avoiding responsibility, and I can't break character.",
      "I checked my availability and the results came back negative.",
      "I'm going to pretend I didn't hear that request and carry on not doing it.",
      "No can do\u2014said in the nicest possible way.",
      "I'm taking a mental health year (starting now), so I have to decline.",
      "I decline to answer on the grounds that it may lead to doing actual work.",
      "Let's be honest: we both know I'm not going to do it.",
      "I'm going to have to nope out for personal reasons (personal reason: I just don't want to).",
      "Not to brag, but I'm really good at not doing things.",
      "Picture a Venn diagram of my schedule and your request\u2014they don't overlap.",
      "I have too many tabs open in my brain, and none of them is about that.",
      "I'm booked solid with introspection (which is code for doing nothing).",
      "I have a to-don't list, and this is right at the top.",
      "I'm overbooked with underachieving.",
      "This request is above my emotional pay grade.",
      "My enthusiasm filed for bankruptcy, so I can't invest in that.",
      "My calendar is full of blank spaces reserved for me-time.",
      "I'm not ignoring you\u2014I'm giving you a firm no.",
      "If I take on one more thing, I'll officially become a cautionary tale.",
      "Think of my refusal as a free lesson in handling rejection.",
      "I admire your persistence in asking, but it's still a no.",
      "I'm already living in the fast lane of doing nothing, so I can't slow down for that.",
      "I can't make it; I'm extremely busy not being busy.",
      "If I help you, I'll feel obligated to help others, and that's a slippery slope I'm avoiding.",
      "The universe told me to 'treat myself', which I'm taking as a sign to stay home.",
      "No one has ever accused me of being too helpful, and I don't plan to start now.",
      "I have a fear of change, so I'm sticking with saying no.",
      "My life is like a Jenga tower; one more thing might make it collapse.",
      "I don't have the bandwidth (or any other width) for that.",
      "Life is short, and my nap list is long.",
      "Frankly, my dear, I don't give a darn (about doing it).",
      "I tried seeing it from your perspective, but I still have to say no.",
      "The timing isn't right\u2014mainly because I just don't want to do it.",
      "I'm in social stealth mode, so I must decline any invitations.",
      "I have a chronic condition called 'idontwanna'.",
      "I'm choosing couch enlightenment over worldly endeavors like that.",
      "I'm off-duty indefinitely.",
      "I'm in the middle of a very delicate 'doing nothing' ritual.",
      "How about I promise to think about it? (I won't, but it sounds polite.)",
      "I have a prior engagement: a staring contest with my wall.",
      "I'll be busy exploring the great indoors.",
      "The couch has accepted me as one of its own, and I can't betray its trust.",
      "'No' is the new 'yes'\u2014I'm just staying on trend.",
      "I'm the hero my couch deserves, so I must stay with it.",
      "The odds of me doing that are about the same as winning the lottery without buying a ticket.",
      "That isn't on my bucket list; in fact, it's on my chuck-it list.",
      "Please excuse me, my brain is currently out of order.",
      "If there were an award for avoiding participation, I'd be the frontrunner.",
      "I'm declining out of an abundance of apathy.",
      "My destiny lies elsewhere\u2014specifically, on my couch.",
      "One does not simply get me to say yes.",
      "It's a no from me, dawg.",
      "If I say yes, I'd have to stop complaining about being busy, and I can't have that.",
      "My energy is solar-powered, and it's nighttime.",
      "I'll take one for the team by not joining this effort.",
      "I put the 'pro' in procrastinate, and I won't ruin my streak.",
      "Even my shadow decided to stay home, so I will too.",
      "Luckily, I have procrastination insurance. It covers me for situations like this.",
      "I'm not my circus, and those are not my monkeys\u2014so it's not my act to perform.",
      "I don't have enough mana for that quest.",
      "The spirit is willing, but the flesh has already ordered takeout and settled in.",
      "My will to do that is in the shop for repairs.",
      "I could list 1000 reasons why I'm saying no, but I'll spare you.",
      "I decline now, to avoid declining later.",
      "I'm choosing myself over this commitment\u2014so, no.",
      "I'll spare you a half-hearted yes and give you an honest no.",
      "If my life were a movie, this is the part I say no and roll credits.",
      "I'm closing the door on that idea (literally and figuratively).",
      "My intuition screamed 'no' so loudly, I had to answer accordingly.",
      "'No' is my happy place.",
      "The answer you seek is not available at this time (try again never).",
      "To quote a famous response: 'No.'",
      "I'm exercising my right to say no.",
      "Think of this as a strategic veto.",
      "I've never been so sure of anything as I am of saying no.",
      "I woke up today and decided it's a 'no' day.",
      "Today, I only speak in negatives.",
      "I'm on a mission to maintain zero commitments.",
      "Even my FitBit is telling me to stay put.",
      "I'm choosing Netflix over stress, sorry.",
      "No, in the most heartfelt, humorous way possible.",
      "My calendar is on strike.",
      "I choose me, so I'm saying no to you.",
      "I'm doing everyone a favor by sticking to what I'm good at: saying no.",
      "No is part of my self-care routine.",
      "This is a guilt-free no.",
      "If I helped, I'd be robbing you of the chance to do it yourself.",
      "My schedule is in airplane mode.",
      "I'm not ghosting you; I'm giving you a firm no.",
      "I'm at peace with saying no.",
      "Negative. Full stop.",
      "I must protect my sanity at all costs\u2014so no.",
      "I didn't come this far to only come this far. In fact, I'm not coming at all.",
      "It's a 'no' from the committee of me, myself, and I.",
      "I must decline; I've reached my threshold for giving a darn.",
      "Even if I wanted to, I couldn't. And I don't want to.",
      "I'm going to seize the opportunity to do nothing instead.",
      "My will to participate has left the building.",
      "Your request has been denied due to a lack of interest on my part.",
      "Let's just assume I said no and move on.",
      "I'm currently out of order. Please try again never.",
      "Alas, I must decline.",
      "Declining this request sparks joy in me.",
      "I could maybe be convinced, but I'd likely still say no in the end.",
      "I have a philosophical objection to doing that.",
      "If I were any more indifferent, I'd be a statue.",
      "I need to prioritize my priorities, which currently are sleeping and snacking.",
      "My schedule has a built-in 'nope' feature.",
      "Saying yes would break the laws of physics in my personal universe.",
      "At this point, saying yes would just feel wrong.",
      "I promised myself I'd stick to being unhelpful this week.",
      "My laziness is in full bloom, and I cannot uproot it for this.",
      "I'm allergic to obligations and break out in excuses.",
      "I'll sit this one out and let karma reward my honesty.",
      "No can do\u2014said in the nicest way possible (still no).",
      "Think of my 'no' as an act of self-care.",
      "I'm exercising my freedom of choice, and I choose no.",
      "I'm hard at work doing nothing at all.",
      "I would help, but that would contradict my life's mission statement.",
      "No, but I appreciate your optimism.",
      "I have a black belt in avoidance, and I'd hate to waste it (so, no).",
      "I'm in the No Witness Protection Program (I say no and then hide).",
      "I have to stay home and make sure gravity continues to work. (Someone has to.)",
      "If I go, who will hold down the fort? (The fort being my couch).",
      "I'm in the middle of a life audit, and unnecessary commitments didn't make the cut.",
      "Declining this is actually part of my five-year plan.",
      "I have too many tabs open in my brain, and none of them is about that task.",
      "I'm not ignoring you\u2014I'm giving you a very clear 'no'.",
      "Not my circus, not my monkeys\u2014so definitely not my act to perform.",
      "I woke up today and thought, 'let's not.'",
      "Pretend I gave you a clever excuse and just take the 'no' as implied."
    ];
  }
});
async function onRequestGet2() {
  try {
    const randomIndex = Math.floor(Math.random() * reasons.length);
    const randomReason = reasons[randomIndex];
    return new Response(JSON.stringify({
      reason: randomReason
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
        // Don't cache so users get different reasons
      }
    });
  } catch (error) {
    console.error("No endpoint error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestGet2, "onRequestGet2");
async function onRequestOptions3() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
__name(onRequestOptions3, "onRequestOptions3");
var init_no = __esm({
  "api/no.js"() {
    init_functionsRoutes_0_2592004221498543();
    init_reasons();
    __name2(onRequestGet2, "onRequestGet");
    __name2(onRequestOptions3, "onRequestOptions");
  }
});
var routes;
var init_functionsRoutes_0_2592004221498543 = __esm({
  "../.wrangler/tmp/pages-Xw8rFj/functionsRoutes-0.2592004221498543.mjs"() {
    init_chat();
    init_chat();
    init_data();
    init_data();
    init_data();
    init_no();
    init_no();
    routes = [
      {
        routePath: "/api/chat",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions]
      },
      {
        routePath: "/api/chat",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/data",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      },
      {
        routePath: "/api/data",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions2]
      },
      {
        routePath: "/api/data",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      },
      {
        routePath: "/api/no",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet2]
      },
      {
        routePath: "/api/no",
        mountPath: "/api",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions3]
      }
    ];
  }
});
init_functionsRoutes_0_2592004221498543();
init_functionsRoutes_0_2592004221498543();
init_functionsRoutes_0_2592004221498543();
init_functionsRoutes_0_2592004221498543();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index2 = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index2, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index2 = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index: index2, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index2 = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index2++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
init_functionsRoutes_0_2592004221498543();
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
init_functionsRoutes_0_2592004221498543();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
init_functionsRoutes_0_2592004221498543();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head2, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head2(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-uinzM7/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head2, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head2(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-uinzM7/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.4615743202981475.js.map
