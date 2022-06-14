import { useEffect, useState } from 'react'
import axios from 'axios'

import './CoinPrice.css'

interface PriceData {
  usd: number
  usd_market_cap: number
  usd_24h_change: number
}

export default function CoinPrice({
  logo,
  id,
  name,
}: {
  logo: string
  id: string
  name: string
}) {
  const [data, setData] = useState<PriceData | undefined>()

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`,
      )
      setData(data[id])
    })()
  }, [id])

  return (
    <div className='coin__price'>
      {data ? (
        <>
          <img src={logo} alt={id} />
          <h3>{name}</h3>
          <p>{data.usd.toFixed(2)} $</p>
          <p
            className={
              data.usd_24h_change < 0
                ? 'price__change down'
                : 'price__change up'
            }
          >
            {data.usd_24h_change.toFixed(2)} %
          </p>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
