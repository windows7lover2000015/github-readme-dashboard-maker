export default async function handler(req, res) {
  // Extract customization parameters from query
  const {
    username = 'octocat',
    theme = 'dark',
    bg_color,
    text_color,
    accent_color,
    border_color,
    border_radius = '10',
    show_icons = 'true',
    show_stars = 'true',
    show_repos = 'true',
    show_followers = 'true'
  } = req.query;

  try {
    // Fetch GitHub API data
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'GitHub-Dashboard-App' }
    });

    if (!userRes.ok) {
      return res.status(404).send('User not found');
    }

    const user = await userRes.json();

    // Default theme presets
    const themes = {
      dark: { bg: '0d1117', text: 'c9d1d9', accent: '58a6ff', border: '30363d' },
      light: { bg: 'ffffff', text: '24292f', accent: '0969da', border: 'd0d7de' },
      dracula: { bg: '282a36', text: 'f8f8f2', accent: 'ff79c6', border: '6272a4' },
      tokyonight: { bg: '1a1b26', text: 'a9b1d6', accent: '7aa2f7', border: '414868' },
      nord: { bg: '2e3440', text: 'd8dee9', accent: '88c0d0', border: '4c566a' }
    };

    const selectedTheme = themes[theme] || themes.dark;

    // Custom colors overriding defaults
    const bg = bg_color ? `#${bg_color}` : `#${selectedTheme.bg}`;
    const text = text_color ? `#${text_color}` : `#${selectedTheme.text}`;
    const accent = accent_color ? `#${accent_color}` : `#${selectedTheme.accent}`;
    const border = border_color ? `#${border_color}` : `#${selectedTheme.border}`;
    const radius = parseInt(border_radius) || 10;

    // Collect requested stat rows
    const stats = [];
    if (show_repos === 'true') stats.push({ icon: '📁', label: 'Public Repos', value: user.public_repos });
    if (show_followers === 'true') stats.push({ icon: '👥', label: 'Followers', value: user.followers });
    if (show_stars === 'true') stats.push({ icon: '⚡', label: 'Following', value: user.following });

    const cardHeight = 90 + stats.length * 35;

    // Build SVG Dynamic Response
    const svg = `
      <svg width="450" height="${cardHeight}" viewBox="0 0 450 ${cardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .header { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: ${accent}; }
          .sub { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; fill: ${text}; opacity: 0.7; }
          .label { font: 400 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${text}; }
          .val { font: 700 13px 'Segoe UI', Ubuntu, sans-serif; fill: ${accent}; }
        </style>
        <rect width="449" height="${cardHeight - 1}" rx="${radius}" fill="${bg}" stroke="${border}" stroke-width="1"/>
        
        <text x="25" y="38" class="header">${user.name || user.login}</text>
        <text x="25" y="56" class="sub">@${user.login}</text>
        <line x1="25" y1="68" x2="425" y2="68" stroke="${border}" stroke-width="1"/>

        ${stats.map((item, idx) => `
          <g transform="translate(25, ${85 + idx * 32})">
            <text x="0" y="12" class="label">${show_icons === 'true' ? item.icon + ' ' : ''}${item.label}:</text>
            <text x="390" y="12" class="val" text-anchor="end">${item.value}</text>
          </g>
        `).join('')}
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).send(svg);
  } catch (err) {
    return res.status(500).send('Error generating card');
  }
}
