import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      WEATHER_URL: JSON.stringify(env.WEATHER_URL)
    }
  }
})
