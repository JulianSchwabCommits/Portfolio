import { onRequestOptions as __api_chat_js_onRequestOptions } from "/home/runner/work/Portfolio/Portfolio/functions/api/chat.js"
import { onRequestPost as __api_chat_js_onRequestPost } from "/home/runner/work/Portfolio/Portfolio/functions/api/chat.js"
import { onRequestGet as __api_data_js_onRequestGet } from "/home/runner/work/Portfolio/Portfolio/functions/api/data.js"
import { onRequestOptions as __api_data_js_onRequestOptions } from "/home/runner/work/Portfolio/Portfolio/functions/api/data.js"
import { onRequestPost as __api_data_js_onRequestPost } from "/home/runner/work/Portfolio/Portfolio/functions/api/data.js"
import { onRequestGet as __api_no_js_onRequestGet } from "/home/runner/work/Portfolio/Portfolio/functions/api/no.js"
import { onRequestOptions as __api_no_js_onRequestOptions } from "/home/runner/work/Portfolio/Portfolio/functions/api/no.js"

export const routes = [
    {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_chat_js_onRequestOptions],
    },
  {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_js_onRequestPost],
    },
  {
      routePath: "/api/data",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_data_js_onRequestGet],
    },
  {
      routePath: "/api/data",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_data_js_onRequestOptions],
    },
  {
      routePath: "/api/data",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_data_js_onRequestPost],
    },
  {
      routePath: "/api/no",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_no_js_onRequestGet],
    },
  {
      routePath: "/api/no",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_no_js_onRequestOptions],
    },
  ]