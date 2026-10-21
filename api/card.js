export default async function handler(req, res) {
  const {
    username = 'windows7lover2000015',
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

    // Theme palettes
    const themes = {
      midnight: { bg: '#0d1117', border: '#30363d', text: '#c9d1d9', accent: '#58a6ff', card: '#161b22' },
      dracula: { bg: '#282a36', border: '#6272a4', text: '#f8f8f2', accent: '#ff79c6', card: '#21222c' },
      sunset: { bg: '#1f1624', border: '#4a3052', text: '#f3e8ff', accent: '#f472b6', card: '#2d1b36' },
      forest: { bg: '#0f1f17', border: '#1e3a29', text: '#e2f8ec', accent: '#34d399', card: '#13281f' },
      nord: { bg: '#2e3440', border: '#4c566a', text: '#d8dee9', accent: '#88c0d0', card: '#3b4252' }
    };

    const t = themes[theme] || themes.midnight;

    // Dynamic height calculation based on toggled sections
    let height = 40;
    if (profile === 'true') height += 90;
    if (stats === 'true') height += 70;
    if (langs === 'true') height += 90;
    if (repos === 'true') height += 100;

    let currentY = 30;

    const svg = `
      <svg width="480" height="${height}" viewBox="0 0 480 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .title { font: 700 16px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.accent}; }
          .sub { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.text}; opacity: 0.7; }
          .text { font: 400 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.text}; }
          .bold { font-weight: 700; fill: ${t.accent}; }
        </style>
        
        <rect width="479" height="${height - 1}" rx="12" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>

        ${profile === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="440" height="75" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="30" class="title">⚡ ${user.name || user.login}</text>
            <text x="20" y="52" class="sub">@${user.login} •${user.public_repos} Public Repos</text>
          </g>
        ` : ''}
        ${profile === 'true' ? (() => { currentY += 90; return ''; })() : ''}

        ${stats === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="440" height="55" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="33" class="text">Followers: <tspan class="bold">${user.followers}</tspan></text>
            <text x="180" y="33" class="text">Following: <tspan class="bold">${user.following}</tspan></text>
            <text x="320" y="33" class="text">Gists: <tspan class="bold">${user.public_gists}</tspan></text>
          </g>
        ` : ''}
        ${stats === 'true' ? (() => { currentY += 70; return ''; })() : ''}

        ${langs === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="440" height="75" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="28" class="title">Top Languages</text>
            <text x="20" y="52" class="text">JavaScript • Python • TypeScript • HTML</text>
          </g>
        ` : ''}
        ${langs === 'true' ? (() => { currentY += 90; return ''; })() : ''}

        ${repos === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="440" height="85" rx="8" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="28" class="title">Pinned Repositories</text>
            <text x="20" y="52" class="text">⭐ github-readme-dashboard</text>
            <text x="20" y="70" class="sub">Dynamic profile tracker built with Vercel</text>
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
