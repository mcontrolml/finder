import axios from 'axios'
import NETWORKS from '../const/network'

const CHUNCK_SIZE = 25

async function queryCW20(
  address: string,
  chunk: string[],
  network: 'mainnet' | 'testnet',
) {
  if(chunk.length === 0) return {}

  const { data } = await axios
    .post(`${NETWORKS[network].hive}/graphql?`, {
      query: `{
       wasm {
        ${chunk
          .map(
            (token) =>
              `${token}: contractQuery(\ncontractAddress: "${token}",\nquery: {balance:{address:"${address}"}}\n)`,
          )
          .join('\n')}
        },
      }`,
    })
    .catch(() => ({ data: { data: { wasm: {} } } }))

  const queryResult = data.data.wasm
  const result: Record<string, string> = {}

  Object.keys(queryResult).forEach((token) => {
    const tokenBalance = queryResult[token].balance
    tokenBalance !== '0' && (result[token] = tokenBalance)
  })
  return result
}

export async function getCW20Balance(
  address: string,
  list: string[],
  network: 'mainnet' | 'testnet',
) {
  const chunks = []
  for (let i = 0; i < list.length; i += CHUNCK_SIZE) {
    const chunk = list.slice(i, i + CHUNCK_SIZE)
    chunks.push(chunk)
  }

  const queries: Promise<Record<string, string>>[] = chunks.map((chunk) =>
    queryCW20(address, chunk, network),
  )
  const results = await Promise.all(queries)

  return results.reduce((acc, result) => ({ ...acc, ...result }), {})
}
