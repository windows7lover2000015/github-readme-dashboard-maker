export default async function handler(req, res) {
  const { username = 'octocat', theme = 'dark' } = req.query;

  try {
    // Fetch user data from GitHub API
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'GitHub-Dashboard-App' }
    });

    if (!userRes.ok) {
      return res.status(404).send('User not found');
    }

    const user = await userRes.json();

    // Theme colors
    const isDark = theme === 'dark';
    const bg = isDark ? '#0d1117' : '#ffffff';
    const text = isDark ? '#c9d1d9' : '#24292f';
    const accent = isDark ? '#58a6ff' : '#0969da';
    const border = isDark ? '#30363d' : '#d0d7de';

    // Build Dynamic SVG Markup
    const svg = `
      <svg width="450" height="200" viewBox="0 0 450 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .header { font: 600 18px 'Segoe UI', Ubuntu, sans-serif; fill: ${accent}; }
          .stat { font: 400 14px 'Segoe UI', Ubuntu, sans-serif; fill: ${text}; }
          .bold { font-weight: 700; }
        </style>
        <rect width="449" height="199" rx="10" fill="${bg}" stroke="${border}" stroke-width="1"/>
        <text x="25" y="45" class="header">@${user.login}'s GitHub Dashboard</text>
        <text x="25" y="90" class="stat">Public Repositories: <tspan class="bold">${user.public_repos}</tspan></text>
        <text x="25" y="120" class="stat">Followers: <tspan class="bold">${user.followers}</tspan></text>
        <text x="25" y="150" class="stat">Following: <tspan class="bold">${user.following}</tspan></text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).send(svg);
  } catch (err) {
    return res.status(500).send('Error generating card');
  }
}
