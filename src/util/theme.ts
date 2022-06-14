export function setTheme(darkMode: boolean) {
  const colors: Record<string, string> = darkMode
    ? {
        '--bg': '#000000',
        '--bg2': '#0e0e14',
        '--text': '#FFFFFF',
        '--main': '#7c59fc',
        '--main-op': ' #6e45ff20',
        '--gray': 'rgb(163, 163, 214)',
      }
    : {
        '--bg': '#F7F7F7',
        '--bg2': 'white',
        '--text': '#0D003F',
        '--main': '#3100E0',
        '--main-op': '#3100E020',
        '--gray': '#8b83a7',
      }

  Object.keys(colors).forEach((key) => {
    document.documentElement.style.setProperty(key, colors[key])
  })
}
