/**
 * getmeta.js — 从远程获取元数据，动态更新最新版本数据
 *
 * 每个请求超时时间：3 秒
 */
(async function () {
    "use strict";

    const REQUEST_TIMEOUT_MS = 3000; // 超时时间

    const SOURCES = [
        // 1 - GitHub CDN 加速（速度较快，能用）
        "https://cdn.jsdelivr.net/gh/ElofHew/RandomCallTool@main/metadata.json",
        // 2 - 第三方 CORS 代理（速度较慢，但可靠）
        "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://raw.githubusercontent.com/ElofHew/RandomCallTool/main/metadata.json"),
        // 3 - GitHub Raw（原生支持 CORS，但可能会被墙）
        "https://raw.githubusercontent.com/ElofHew/RandomCallTool/main/metadata.json",
    ];

    const linkEl = document.getElementById("lanzou-link");
    const pwdEl = document.getElementById("lanzou-pwd");
    const verEl = document.getElementById("meta-version");
    const dateEl = document.getElementById("meta-date");
    const vcEl = document.getElementById("meta-vercode");

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
            console.log(`尝试从 ${url} 获取元数据...`);
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
            if (meta.version.vercode && vcEl) {
                vcEl.href = "docs/history.html#" + meta.version.vercode;
            }
        }
        // ── 蓝奏云链接 ──
        if (meta.lanzou) {
            if (meta.lanzou.download && linkEl) {
                linkEl.href = meta.lanzou.download;
                linkEl.target = "_blank";
            }
            if (meta.lanzou.password && pwdEl) {
                pwdEl.textContent = "提取码：" + meta.lanzou.password;
            }
        }
    } else {
        console.warn("所有下载元数据源均不可达，保留 HTML 中的默认值");
    }
})();
