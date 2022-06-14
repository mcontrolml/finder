import COUNTRY from '../country'

export default function nodesByCountry(list, limit = 0) {
  const topCountry = {}
  const result = []

  ;(list || []).forEach((node) => {
    if(node.country_code) {
      topCountry[node.country_code] ||= 0
      topCountry[node.country_code]++
    }
  })

  Object.keys(topCountry).forEach((code) => {
    result.push({
      y: topCountry[code],
      code,
      flag: COUNTRY[code].emoji,
      name: COUNTRY[code].name,
    })
  })

  result.sort((a, b) => b.y - a.y)

  const filteredResult = []
  result.forEach((country, i) => {
    if (i < limit) filteredResult.push(country)
    else {
      filteredResult[limit] ||= { y: 0, flag: 'Other', name: 'Other' }
      filteredResult[limit].y += country.y
    }
  })

  return limit ? filteredResult : result
}
