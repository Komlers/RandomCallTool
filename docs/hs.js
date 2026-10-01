// Header
document.getElementById("header").innerHTML = `
<b><a href="../">随机抽取工具</a></b>
<div class="header-right">
    <a href="../">首页</a>
    <a href="../docs/">文档</a>
    <a href="#sidebar">展开目录</a>
</div>
`;

// Sidebar
document.getElementById("sidebar").innerHTML = `
<h3>目录</h3>
<ul>
    <li><a href="../docs/">帮助文档：主页面</a></li>
    <li><a href="#">第一部分 · 主程序帮助</a></li>
    <ul>
        <li><a href="1-1.html">随机抽取操作指南</a></li>
        <li><a href="1-2.html">随机点名操作指南</a></li>
        <li><a href="1-3.html">悬浮球与桌面集成</a></li>
        <li><a href="1-4.html">软件配置详细详解</a></li>
        <li><a href="1-5.html">抽样模式详细讲解</a></li>
    </ul>
    <li><a href="#">第二部分 · 工具与优化</a></li>
    <ul>
        <li><a href="2-1.html">独立更新程序</a></li>
        <li><a href="2-2.html">独立卸载程序</a></li>
        <li><a href="2-3.html">快捷键支持</a></li>
        <li><a href="2-4.html">跨平台说明</a></li>
    </ul>
    <li><a href="#">第三部分 · 说明与更多</a></li>
    <ul>
        <li><a href="3-1.html">版本号命名规则</a></li>
        <li><a href="3-2.html">版本更新日志记录</a></li>
        <li><a href="3-3.html">常见问题与注意事项</a></li>
    </ul>
</ul>
<h3>仓库</h3>
<ul>
    <li><a href="https://github.com/ElofHew/RandomCallTool" target="_blank">GitHub</a></li>
    <li><a href="https://gitee.com/ElofHew/RandomCallTool" target="_blank">Gitee</a></li>
</ul>
`;

document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggleLink = document.querySelector('a[href="#sidebar"]');
    const sidebar = document.getElementById('sidebar');
    const container = document.querySelector('.container');

    function adjustSidebarAndContainerOnLoad() {
        if (window.innerWidth > 800) {
            sidebar.style.display = 'block';
            sidebarToggleLink.innerHTML = '收起目录';
            container.style.marginLeft = '260px';
        } else {
            sidebar.style.display = 'none';
            sidebarToggleLink.innerHTML = '展开目录';
            container.style.marginLeft = '0';
        }
    }

    adjustSidebarAndContainerOnLoad();

    sidebarToggleLink.addEventListener('click', function(event) {
        event.preventDefault();

        if (sidebar.style.display === 'none' || sidebar.style.display === '') {
            sidebar.style.display = 'block';
            sidebarToggleLink.innerHTML = '收起目录';
            if (window.innerWidth > 800) {
                container.style.marginLeft = '260px';
            }
        } else {
            sidebar.style.display = 'none';
            sidebarToggleLink.innerHTML = '展开目录';
            container.style.marginLeft = '0';
        }
    });

    window.addEventListener('resize', function() {
        if (sidebar.style.display === 'block') {
            if (window.innerWidth > 800) {
                container.style.marginLeft = '260px';
            } else {
                container.style.marginLeft = '0';
            }
        } else {
            container.style.marginLeft = '0';
        }
    });
});
