import Search from '../../components/search/Search'
import Banner from '../../components/banner/Banner'
import MobileLogo from '../../components/logo/MobileLogo'

import CoinPrice from './components/price/CoinPrice'

import './Explorer.css'

export default function Explorer() {
  return (
    <main className='content'>
      <MobileLogo />
      <h1>Block Explorer</h1>
      <Search />
      <Banner small />
      <div className='content__box'>
        <CoinPrice id='terra-luna-2' logo='https://assets.terra.money/icon/svg/LUNA.png' name='LUNA' />
        <p className='coingecko__attribution'>Prices by <a href='https://www.coingecko.com/' target='blank' >Coingecko</a></p>
        <div className='warning' style={{ marginTop: 15}}>
          <h4>
            <i className='bx bxs-info-circle'></i> Info
          </h4>
          <p>Our explorer is still in development, and has limited functions.<br/>We will make it open source soon!</p>
        </div>
      </div>
    </main>
  )
}
