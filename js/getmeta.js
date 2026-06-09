/**
 * getmeta.js — 从远程获取元数据，动态更新蓝奏云下载链接
 *
 * 降级链：
 *   1. https://raw.giteeusercontent.com/…  （Gitee raw，国内快）
 *   2. https://raw.githubusercontent.com/… （GitHub raw，支持 CORS）
 *   3. https://api.allorigins.win/raw?url=…（CORS 代理兜底）
 *   全部失败则保留 HTML 中的默认值。
 */
(async function () {
    "use strict";

    const SOURCES = [
        "https://raw.giteeusercontent.com/ElofHew/RandomCallTool/raw/main/metadata.json",
        "https://raw.githubusercontent.com/ElofHew/RandomCallTool/main/metadata.json",
        "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(
                "https://raw.githubusercontent.com/ElofHew/RandomCallTool/main/metadata.json"
            ),
    ];

    const linkEl = document.getElementById("lanzou-link");
    const pwdEl = document.getElementById("lanzou-pwd");
    if (!linkEl || !pwdEl) return;

    /**
     * 尝试从单个 URL 拉取并解析 JSON
     * @param {string} url
     * @returns {Promise<object|null>}
     */
    async function tryFetch(url) {
        try {
            const resp = await fetch(url, {
                cache: "no-cache",
                mode: "cors",
            });
            if (!resp.ok) return null;
            return await resp.json();
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

    if (meta && meta.lanzou) {
        if (meta.lanzou.download) {
            linkEl.href = meta.lanzou.download;
        }
        if (meta.lanzou.password) {
            pwdEl.textContent = "提取码：" + meta.lanzou.password;
        }
    } else {
        console.warn("所有下载元数据源均不可达，保留 HTML 中的默认值");
    }
})();
