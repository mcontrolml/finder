import COUNTRY from '../country'

export default function nodesByCity(list) {
  const topCity = {}
  const result = []

  const CITIES = {
    Unknown: {
      code: 'UNKNOWN',
      flag: '❓',
      country: 'Unknown',
    },
  }

  ;(list || []).forEach((node) => {
    const cityName = node.city || 'Unknown'
    topCity[cityName] ||= 0
    topCity[cityName]++

    if (CITIES[cityName]) return
    CITIES[cityName] = {
      code: node.country_code,
      flag: COUNTRY[node.country_code].emoji,
      country: COUNTRY[node.country_code].name,
    }
  })

  Object.keys(topCity).forEach((city) => {
    result.push({
      y: topCity[city],
      name: city,
      ...CITIES[city],
    })
  })

  result.sort((a, b) => b.y - a.y)

  return result
}
