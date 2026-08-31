export interface Env {
  GITHUB_TOKEN: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const OWNER = 'lexanachile';
    const REPO = 'FamcsSkedBot';
    const WORKFLOW = 'parser.yml';  // ← именно ваш файл

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Cloudflare-Worker-Cron',
        },
        body: JSON.stringify({ ref: 'main' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Ошибка: ${response.status} - ${errorText}`);
      } else {
        console.log('✅ parser.yml запущен!');
      }
    } catch (error) {
      console.error('❌ Ошибка запроса:', error);
    }
  },
};
