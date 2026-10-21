export default async function handler(req, res) {
  const {
    username = 'octocat',
    theme = 'midnight',
    profile = 'true',
    stats = 'true',
    langs = 'true',
    repos = 'true'
  } = req.query;

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'GitHub-Dashboard-App' }
    });

    if (!userRes.ok) {
      return res.status(404).send('User not found');
    }

    const user = await userRes.json();

    // Theme Palettes matching your friend's app
    const themes = {
      midnight: { bg: '#0d1117', border: '#30363d', text: '#c9d1d9', accent: '#58a6ff', card: '#161b22', sub: '#8b949e' },
      dracula: { bg: '#282a36', border: '#6272a4', text: '#f8f8f2', accent: '#ff79c6', card: '#21222c', sub: '#6272a4' },
      sunset: { bg: '#1f1624', border: '#4a3052', text: '#f3e8ff', accent: '#f472b6', card: '#2d1b36', sub: '#a78bfa' },
      forest: { bg: '#0f1f17', border: '#1e3a29', text: '#e2f8ec', accent: '#34d399', card: '#13281f', sub: '#6ee7b7' },
      nord: { bg: '#2e3440', border: '#4c566a', text: '#d8dee9', accent: '#88c0d0', card: '#3b4252', sub: '#99c2df' }
    };

    const t = themes[theme] || themes.midnight;

    let height = 30;
    if (profile === 'true') height += 105;
    if (stats === 'true') height += 75;
    if (langs === 'true') height += 120;
    if (repos === 'true') height += 110;

    let currentY = 20;

    const svg = `
      <svg width="490" height="${height}" viewBox="0 0 490 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .name { font: 700 16px 'Segoe UI', Ubuntu, sans-serif; fill: #ffffff; }
          .handle { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.sub}; }
          .bio { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.text}; }
          .section-title { font: 600 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.accent}; }
          .stat-label { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.sub}; }
          .stat-val { font: 700 15px 'Segoe UI', Ubuntu, sans-serif; fill: #ffffff; }
          .lang-text { font: 500 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.text}; }
        </style>

        <rect width="489" height="${height - 1}" rx="14" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>

        <!-- Profile Section -->
        ${profile === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="450" height="90" rx="10" fill="${t.card}" stroke="${t.border}"/>
            <circle cx="45" cy="45" r="25" fill="${t.border}"/>
            <image href="${user.avatar_url}" x="20" y="20" height="50" width="50" clip-path="circle(25px at 25px 25px)"/>
            <text x="85" y="38" class="name">${user.name || user.login}</text>
            <text x="85" y="55" class="handle">@${user.login} • Joined ${new Date(user.created_at).getFullYear()}</text>
            <text x="85" y="73" class="bio">Building open source tools and web apps.</text>
          </g>
        ` : ''}
        ${profile === 'true' ? (() => { currentY += 105; return ''; })() : ''}

        <!-- Stats Grid Section -->
        ${stats === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect x="0" y="0" width="108" height="60" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="12" y="22" class="stat-label">Public Repos</text>
            <text x="12" y="45" class="stat-val">${user.public_repos}</text>

            <rect x="114" y="0" width="108" height="60" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="126" y="22" class="stat-label">Followers</text>
            <text x="126" y="45" class="stat-val">${user.followers}</text>

            <rect x="228" y="0" width="108" height="60" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="240" y="22" class="stat-label">Following</text>
            <text x="240" y="45" class="stat-val">${user.following}</text>

            <rect x="342" y="0" width="108" height="60" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="354" y="22" class="stat-label">Gists</text>
            <text x="354" y="45" class="stat-val">${user.public_gists}</text>
          </g>
        ` : ''}
        ${stats === 'true' ? (() => { currentY += 75; return ''; })() : ''}

        <!-- Top Languages Section -->
        ${langs === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="450" height="105" rx="10" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="28" class="section-title">Language breakdown</text>
            
            <text x="20" y="55" class="lang-text">JavaScript</text>
            <rect x="120" y="45" width="240" height="8" rx="4" fill="${t.border}"/>
            <rect x="120" y="45" width="160" height="8" rx="4" fill="#f1e05a"/>
            <text x="380" y="55" class="lang-text">65%</text>

            <text x="20" y="82" class="lang-text">Python</text>
            <rect x="120" y="72" width="240" height="8" rx="4" fill="${t.border}"/>
            <rect x="120" y="72" width="60" height="8" rx="4" fill="#3572A5"/>
            <text x="380" y="82" class="lang-text">25%</text>
          </g>
        ` : ''}
        ${langs === 'true' ? (() => { currentY += 120; return ''; })() : ''}

        <!-- Pinned Repos Section -->
        ${repos === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="450" height="95" rx="10" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="28" class="section-title">Top repositories</text>
            <text x="20" y="55" class="name" style="font-size: 13px;">📂 github-readme-dashboard</text>
            <text x="20" y="73" class="handle">Live tracking metrics generator for developer profiles.</text>
          </g>
        ` : ''}

      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).send(svg);
  } catch (err) {
    return res.status(500).send('Error generating card');
  }
}
