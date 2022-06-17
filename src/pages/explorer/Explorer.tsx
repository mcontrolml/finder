import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import NETWORKS from '../../const/network'
import STATE from '../../state'

import Search from '../../components/search/Search'
import Banner from '../../components/banner/Banner'
import MobileLogo from '../../components/logo/MobileLogo'

import CoinPrice from './components/price/CoinPrice'

import './Explorer.css'
import { Loading } from '../../components/loading/Loading'

export default function Explorer() {
  const network = useRecoilValue(STATE.network)

  const [isLoading, setLoading] = useState<boolean>(true)
  const [avgTime, setAvgTime] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [txs, setTxs] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const { data: latestBlock } = await axios.get(
        `${NETWORKS[network].LCD}/blocks/latest`,
      )

      const currentHeight = parseInt(latestBlock.block.header.height)
      setHeight(currentHeight)

      const { data: oldBlock } = await axios.get(
        `${NETWORKS[network].LCD}/blocks/${currentHeight - 10_000}`,
      )

      setAvgTime(
        (new Date(latestBlock.block.header.time).getTime() -
          new Date(oldBlock.block.header.time).getTime()) /
          10_000,
      )
      setTxs(latestBlock.block.data.txs.length)
      setLoading(false)
    })()
  }, [network])

  return (
    <main className='content'>
      <MobileLogo />
      <h1>Block Explorer</h1>
      <Search />
      <Banner small />
      <div className='content__box'>
        <h3>Prices</h3>
        <CoinPrice
          id='terra-luna-2'
          logo='https://assets.terra.money/icon/svg/LUNA.png'
          name='LUNA'
        />
        <p className='coingecko__attribution'>
          Prices by{' '}
          <a href='https://www.coingecko.com/' target='blank'>
            Coingecko
          </a>
        </p>
      </div>
      <div className='content__box chain__status'>
        <h3>Chain status</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className='chain__status__container'>
              <div>
                <h1>
                  {height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")}
                </h1>
                <p>Latest block</p>
              </div>
              <div>
                <h1>{txs}</h1>
                <p>Tx in the block</p>
              </div>
            </div>
            <div>
              <h1>{(avgTime / 1000).toFixed(2)}s</h1>
              <p>Avg. Block Time</p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
