<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitDash Studio - Dynamic GitHub README Cards</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #0d1117; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .glass-panel { background: #161b22; border: 1px solid #30363d; border-radius: 12px; }
        .gradient-text { background: linear-gradient(135deg, #58a6ff 0%, #bc8cff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    </style>
</head>
<body class="min-h-screen flex flex-col">

    <!-- Header -->
    <header class="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="bg-blue-600/20 text-[#58a6ff] p-2 rounded-lg border border-blue-500/30">
                <i class="fa-solid fa-chart-simple text-xl"></i>
            </div>
            <div>
                <h1 class="font-bold text-lg text-white">GitDash <span class="gradient-text">Studio</span></h1>
                <p class="text-xs text-gray-400">Live README Profile Cards Generator</p>
            </div>
        </div>
        <a href="https://github.com" target="_blank" class="text-xs text-gray-300 bg-[#21262d] hover:bg-[#30363d] px-3 py-2 rounded-md border border-[#30363d] transition">
            <i class="fa-brands fa-github mr-1"></i> GitHub
        </a>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left Panel: Controls -->
        <div class="lg:col-span-5 flex flex-col gap-6">
            <div class="glass-panel p-6 space-y-5">
                <h2 class="text-md font-semibold text-white flex items-center gap-2 border-b border-[#30363d] pb-3">
                    <i class="fa-solid fa-sliders text-[#58a6ff]"></i> Customization Settings
                </h2>

                <!-- GitHub Username Input -->
                <div>
                    <label class="block text-xs font-medium text-gray-300 mb-2">GitHub Username</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
                        <input type="text" id="usernameInput" value="octocat" placeholder="Enter username" 
                            class="w-full pl-8 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white focus:outline-none focus:border-[#58a6ff]">
                    </div>
                </div>

                <!-- Color Theme Picker -->
                <div>
                    <label class="block text-xs font-medium text-gray-300 mb-2">Color Theme</label>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="setTheme('dark')" id="btn-dark" class="px-4 py-2 rounded-lg border border-[#58a6ff] bg-[#1f242c] text-xs font-medium text-white flex items-center justify-between">
                            Dark Theme <span class="w-3 h-3 rounded-full bg-[#0d1117] border border-[#58a6ff]"></span>
                        </button>
                        <button onclick="setTheme('light')" id="btn-light" class="px-4 py-2 rounded-lg border border-[#30363d] bg-[#161b22] text-xs font-medium text-gray-400 flex items-center justify-between">
                            Light Theme <span class="w-3 h-3 rounded-full bg-white border border-gray-300"></span>
                        </button>
                    </div>
                </div>

                <button onclick="updatePreview()" class="w-full py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-lg transition shadow-lg flex items-center justify-center gap-2">
                    <i class="fa-solid fa-arrows-rotate"></i> Update Preview
                </button>
            </div>

            <!-- Markdown Output Snippet -->
            <div class="glass-panel p-6 space-y-3">
                <h2 class="text-md font-semibold text-white flex items-center gap-2">
                    <i class="fa-solid fa-code text-[#bc8cff]"></i> README Markdown Embed
                </h2>
                <div class="relative">
                    <textarea id="markdownCode" readonly class="w-full h-24 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs font-mono text-gray-300 resize-none focus:outline-none"></textarea>
                    <button onclick="copyMarkdown()" class="absolute top-2 right-2 px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-xs text-gray-200 transition">
                        <i class="fa-regular fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        </div>

        <!-- Right Panel: Live Dynamic Preview -->
        <div class="lg:col-span-7 flex flex-col gap-6">
            <div class="glass-panel p-6 flex flex-col items-center justify-center min-h-[350px]">
                <div class="w-full flex items-center justify-between border-b border-[#30363d] pb-3 mb-6">
                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Preview</span>
                    <span class="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Active API
                    </span>
                </div>

                <!-- Live SVG Embed Frame -->
                <div id="previewContainer" class="p-4 rounded-xl border border-[#30363d] bg-[#0d1117] shadow-2xl transition-all max-w-full overflow-x-auto">
                    <img id="cardPreview" src="" alt="GitHub Dashboard Preview" class="max-w-full h-auto">
                </div>
            </div>
        </div>
    </main>

    <script>
        let currentTheme = 'dark';

        function setTheme(theme) {
            currentTheme = theme;
            document.getElementById('btn-dark').className = theme === 'dark' 
                ? 'px-4 py-2 rounded-lg border border-[#58a6ff] bg-[#1f242c] text-xs font-medium text-white flex items-center justify-between'
                : 'px-4 py-2 rounded-lg border border-[#30363d] bg-[#161b22] text-xs font-medium text-gray-400 flex items-center justify-between';
            
            document.getElementById('btn-light').className = theme === 'light' 
                ? 'px-4 py-2 rounded-lg border border-[#58a6ff] bg-[#1f242c] text-xs font-medium text-white flex items-center justify-between'
                : 'px-4 py-2 rounded-lg border border-[#30363d] bg-[#161b22] text-xs font-medium text-gray-400 flex items-center justify-between';
            
            updatePreview();
        }

        function updatePreview() {
            const username = document.getElementById('usernameInput').value.trim() || 'octocat';
            const apiUrl = `${window.location.origin}/api/card?username=${username}&theme=${currentTheme}`;
            
            document.getElementById('cardPreview').src = apiUrl;
            document.getElementById('markdownCode').value = `![GitHub Dashboard](${apiUrl})`;
        }

        function copyMarkdown() {
            const markdownText = document.getElementById('markdownCode');
            markdownText.select();
            navigator.clipboard.writeText(markdownText.value);
            alert('Copied Markdown embed code!');
        }

        // Initialize on load
        window.onload = updatePreview;
    </script>
</body>
</html>
