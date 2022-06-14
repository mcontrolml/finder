import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

import './Endpoint.css'
import Banner from '../../components/banner/Banner'
import MobileLogo from '../../components/logo/MobileLogo'

function EndpointUrl({ name, url }: { name: string; url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className='endpoint'>
      {name}:{' '}
      <div className='endpoint__url'>
        <span>{url}</span>
        <button
          onClick={() => {
            setCopied(true)
            navigator.clipboard.writeText(`https://${url}`)
            setTimeout(() => setCopied(false), 800)
          }}
        >
          {copied ? (
            <i className='bx bx-check'></i>
          ) : (
            <i className='bx bxs-copy'></i>
          )}
        </button>
      </div>
    </div>
  )
}

export default function Endpoint() {
  const { chain } = useParams()

  return (
    <main className='content'>
      <MobileLogo />
      <h1>Public endpoints</h1>
      <div className='nav'>
        <NavLink
          to='/endpoints/phoenix'
          className={({ isActive }) =>
            isActive ? 'slink slink__active' : 'slink'
          }
        >
          phoenix-1
        </NavLink>
        <NavLink
          to='/endpoints/pisco'
          className={({ isActive }) =>
            isActive ? 'slink slink__active' : 'slink'
          }
        >
          pisco-1
        </NavLink>
        <NavLink
          to='/endpoints/columbus'
          className={({ isActive }) =>
            isActive ? 'slink slink__active' : 'slink'
          }
        >
          columbus-5
        </NavLink>
      </div>
      <Banner />

      <div className='content__box'>
        <h3>{chain}</h3>
        {chain === 'phoenix' ? (
          <div className='endpoint__container'>
            <p>
              Our free and public endpoints for <b>phoenix-1</b>:
            </p>
            <EndpointUrl name='LCD' url='lcd.mcontrol.ml' />
            <EndpointUrl name='RPC' url='terra-node.mcontrol.ml' />
          </div>
        ) : (
          <div className='comingsoon'>
            <i className='bx bxs-time-five'></i>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </main>
  )
}
