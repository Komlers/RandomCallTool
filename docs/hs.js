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
    <li><a href="#">主程序使用帮助</a></li>
    <ul>
        <li><a href="1-1.html">随机抽组操作指南</a></li>
        <li><a href="1-2.html">随机抽人操作指南</a></li>
        <li><a href="1-3.html">抽样模式详解</a></li>
    </ul>
    <li><a href="#">编码工具及更多</a></li>
    <ul>
        <li><a href="2-1.html">名单编码工具说明</a></li>
        <li><a href="2-2.html">配置与快捷键</a></li>
        <li><a href="2-3.html">常见问题与注意事项</a></li>
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
