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

    // Fetch avatar as base64 to ensure it renders reliably in READMEs
    let avatarBase64 = '';
    try {
      const imgRes = await fetch(user.avatar_url);
      const buffer = await imgRes.arrayBuffer();
      avatarBase64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
    } catch {
      avatarBase64 = user.avatar_url;
    }

    const themes = {
      midnight: { bg: '#0d1117', border: '#30363d', text: '#c9d1d9', accent: '#58a6ff', card: '#161b22', sub: '#8b949e' },
      dracula: { bg: '#282a36', border: '#6272a4', text: '#f8f8f2', accent: '#ff79c6', card: '#21222c', sub: '#6272a4' },
      sunset: { bg: '#1f1624', border: '#4a3052', text: '#f3e8ff', accent: '#f472b6', card: '#2d1b36', sub: '#a78bfa' },
      forest: { bg: '#0f1f17', border: '#1e3a29', text: '#e2f8ec', accent: '#34d399', card: '#13281f', sub: '#6ee7b7' },
      nord: { bg: '#2e3440', border: '#4c566a', text: '#d8dee9', accent: '#88c0d0', card: '#3b4252', sub: '#99c2df' }
    };

    const t = themes[theme] || themes.midnight;

    let height = 30;
    if (profile === 'true') height += 100;
    if (stats === 'true') height += 75;
    if (langs === 'true') height += 110;
    if (repos === 'true') height += 95;

    let currentY = 20;

    const svg = `
      <svg width="490" height="${height}" viewBox="0 0 490 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .name { font: 700 15px 'Segoe UI', Ubuntu, sans-serif; fill: #ffffff; }
          .handle { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.sub}; }
          .section-title { font: 600 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.accent}; }
          .stat-label { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.sub}; }
          .stat-val { font: 700 14px 'Segoe UI', Ubuntu, sans-serif; fill: #ffffff; }
          .lang-text { font: 500 11px 'Segoe UI', Ubuntu, sans-serif; fill: ${t.text}; }
        </style>

        <rect width="489" height="${height - 1}" rx="14" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>

        ${profile === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="450" height="85" rx="10" fill="${t.card}" stroke="${t.border}"/>
            <circle cx="45" cy="42" r="22" fill="${t.border}"/>
            <image href="${avatarBase64}" x="23" y="20" height="44" width="44" clip-path="circle(22px at 22px 22px)"/>
            <text x="85" y="38" class="name">${user.name || user.login}</text>
            <text x="85" y="55" class="handle">@${user.login} • Joined ${new Date(user.created_at).getFullYear()}</text>
          </g>
        ` : ''}
        ${profile === 'true' ? (() => { currentY += 100; return ''; })() : ''}

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

        ${langs === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="450" height="95" rx="10" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="25" class="section-title">Profile Overview</text>
            <text x="20" y="52" class="lang-text">Bio: ${user.bio || 'Open source developer'}</text>
            <text x="20" y="76" class="lang-text">Location: ${user.location || 'Global'}</text>
          </g>
        ` : ''}
        ${langs === 'true' ? (() => { currentY += 110; return ''; })() : ''}

        ${repos === 'true' ? `
          <g transform="translate(20, ${currentY})">
            <rect width="450" height="80" rx="10" fill="${t.card}" stroke="${t.border}"/>
            <text x="20" y="25" class="section-title">Profile Link</text>
            <text x="20" y="50" class="name" style="font-size: 13px;">🔗 github.com/${user.login}</text>
            <text x="20" y="66" class="handle">Public GitHub Profile Dashboard</text>
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
