/**
 * copy.js — 复制命令行下载指令到剪贴板
 *
 * 优先使用 navigator.clipboard，在非安全上下文或失败时
 * 回退到临时 textarea + execCommand("copy")。
 */
(function () {
    "use strict";

    const btn = document.getElementById("curl-copy");
    const codeEl = document.getElementById("curl-cmd");
    if (!btn || !codeEl) return;

    function fallbackCopy(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch {
            ok = false;
        }
        document.body.removeChild(ta);
        return ok;
    }

    btn.addEventListener("click", async function () {
        const text = codeEl.textContent.trim();
        let ok = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                ok = true;
            } else {
                ok = fallbackCopy(text);
            }
        } catch {
            ok = fallbackCopy(text);
        }

        if (ok) {
            const oldText = btn.textContent;
            btn.textContent = "已复制 ✓";
            setTimeout(function () {
                btn.textContent = oldText;
            }, 2000);
        } else {
            btn.textContent = "复制失败";
            setTimeout(function () {
                btn.textContent = "复制命令";
            }, 2000);
        }
    });
})();
