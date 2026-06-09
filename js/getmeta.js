/**
 * getmeta.js — 从远程获取元数据，动态更新蓝奏云下载链接
 *
 * 降级链（针对国内访问优化）：
 *   1. https://gitee.com/…/raw/…          （Gitee 直连，国内最快，支持 CORS）
 *   2. https://raw.giteeusercontent.com/… （Gitee CDN 加速，备用）
 *   3. https://api.allorigins.win/raw?url=…（CORS 代理兜底，速度较慢但可靠）
 *   4. https://raw.githubusercontent.com/…（GitHub raw，无 CORS 头，作为最后尝试）
 *   全部失败则保留 HTML 中的默认值。
 * 
 * 每个请求超时时间：2 秒
 */
(async function () {
    "use strict";

    const REQUEST_TIMEOUT_MS = 2000; // 超时时间 2 秒

    const SOURCES = [
        // 第一优先：Gitee 直连（国内最快，支持 CORS）
        "https://gitee.com/ElofHew/RandomCallTool/raw/main/metadata.json",
        // 第二优先：Gitee CDN 加速（备用）
        "https://raw.giteeusercontent.com/ElofHew/RandomCallTool/raw/main/metadata.json",
        // 第三优先：CORS 代理（兜底，速度慢但可靠）
        "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(
                "https://raw.githubusercontent.com/ElofHew/RandomCallTool/main/metadata.json"
            ),
        // 第四优先：GitHub raw（无 CORS 头，浏览器可能阻止，但作为最后尝试）
        "https://raw.githubusercontent.com/ElofHew/RandomCallTool/main/metadata.json",
    ];

    const linkEl = document.getElementById("lanzou-link");
    const pwdEl = document.getElementById("lanzou-pwd");
    const verEl = document.getElementById("meta-version");
    const dateEl = document.getElementById("meta-date");

    /**
     * 带超时控制的 fetch 请求
     * @param {string} url 请求地址
     * @param {number} timeoutMs 超时时间（毫秒）
     * @returns {Promise<Response|null>}
     */
    async function fetchWithTimeout(url, timeoutMs) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, {
                cache: "no-cache",
                mode: "cors",
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            // 区分超时错误和其他错误
            if (error.name === "AbortError") {
                console.warn(`请求超时 (${timeoutMs}ms): ${url}`);
            }
            return null;
        }
    }

    /**
     * 尝试从单个 URL 拉取并解析 JSON
     * @param {string} url
     * @returns {Promise<object|null>}
     */
    async function tryFetch(url) {
        try {
            const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
            if (!response || !response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    }

    // 逐个源尝试
    let meta = null;
    for (const url of SOURCES) {
        meta = await tryFetch(url);
        if (meta) break;
    }

    if (meta) {
        // ── 版本信息 ──
        if (meta.version) {
            if (meta.version.version && verEl) {
                verEl.textContent = "v" + meta.version.version;
            }
            if (meta.version.date && dateEl) {
                dateEl.textContent = meta.version.date;
            }
        }
        // ── 蓝奏云链接 ──
        if (meta.lanzou) {
            if (meta.lanzou.download && linkEl) {
                linkEl.href = meta.lanzou.download;
            }
            if (meta.lanzou.password && pwdEl) {
                pwdEl.textContent = "提取码：" + meta.lanzou.password;
            }
        }
    } else {
        console.warn("所有下载元数据源均不可达，保留 HTML 中的默认值");
    }
})();
