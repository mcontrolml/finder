import { useEffect, useState } from 'react'

import { useRecoilValue } from 'recoil'
import STATE from '../../state'

import { Loading } from '../../components/loading/Loading'
import './Ibc.css'
import Banner from '../../components/banner/Banner'
import MobileLogo from '../../components/logo/MobileLogo'

import connectionSvg from './connection.svg'
import connectionDarkSvg from './connectionDark.svg'
import { getIbcChannels } from '../../util/ibc'
import { IbcChannelInterface } from '../../types/ibc'

function IbcChannel({
  logo = 'https://assets.mcontrol.ml/coins/unknown.svg',
  name,
  chainID,
  channel,
  otherChannel,
  active,
  client,
}: {
  logo?: string
  name?: string
  chainID: string
  channel: string
  otherChannel: string
  active: boolean
  client: string
}) {
  const darkMode = useRecoilValue(STATE.darkMode)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='channel__container'>
      <div className='channel' onClick={() => setIsOpen(!isOpen)}>
        <div className='channel__name'>
          <img src={logo} alt={name} className='channel__img' />
          <div className='channel__chain'>
            <h4>{name}</h4>
            <p>{chainID}</p>
          </div>
        </div>
        <div className='channel__status__container'>
          <span
            className={active ? 'channel__status' : 'channel__status halted'}
          >
            {active ? 'active' : 'halted'}
          </span>
          <button className={isOpen ? 'open' : 'close'}>
            <i className='bx bx-chevron-down'></i>
          </button>
        </div>
      </div>

      <div
        className={
          isOpen
            ? 'channel__details channel__details__open'
            : 'channel__details'
        }
      >
        <div className='channel__details__container'>
          <div className='channel__details__chain channel__left'>
            <img src='https://assets.mcontrol.ml/coins/TERRA.svg' alt='Terra' />
            <span>{channel}</span>
          </div>
          <img
            src={darkMode ? connectionDarkSvg : connectionSvg}
            alt='connection'
            className='channel__details__line'
          />
          <div className='channel__details__chain channel__right'>
            <span>{otherChannel}</span>
            <img src={logo} alt={name} />
          </div>
        </div>
        <p className='channel__client'>{client}</p>
      </div>
    </div>
  )
}

export default function Ibc() {
  const [isLoading, setIsLoading] = useState(true)
  const [ibcData, setIbcData] = useState<IbcChannelInterface[]>([])

  useEffect(() => {
    ;(async () => {
      const ibc = await getIbcChannels()
      setIbcData(ibc)
      setIsLoading(false)
    })()
  }, [])

  return (
    <main className='content'>
      <MobileLogo />
      <h1>IBC channels</h1>

      <Banner />

      <div className='content__box'>
        <h3>Channels</h3>
        {isLoading ? (
          <Loading />
        ) : (
          ibcData.map((ch: IbcChannelInterface) => (
            <IbcChannel key={ch.channel} {...ch} />
          ))
        )}
      </div>
    </main>
  )
}
