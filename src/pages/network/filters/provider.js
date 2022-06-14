export default function nodesByProvider(list, limit = 0) {
  const topProvider = {}
  const result = []

  ;(list || []).forEach((node) => {
    topProvider[node.datacenter] ||= 0
    topProvider[node.datacenter]++
  })

  Object.keys(topProvider).forEach((provider) => {
    result.push({
      y: topProvider[provider],
      name: provider,
    })
  })

  result.sort((a, b) => b.y - a.y)

  const filteredResult = []
  result.forEach((country, i) => {
    if (i < limit) filteredResult.push(country)
    else {
      filteredResult[limit] ||= { y: 0, name: 'Other' }
      filteredResult[limit].y += country.y
    }
  })

  return limit ? filteredResult : result
}
