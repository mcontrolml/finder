import { Link, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import STATE from '../../state'

import './Header.css'
import mcontrolSvg from '../../img/mcontrol.svg'
import mcontrolWhiteSvg from '../../img/mcontrolWhite.svg'
import iconSvg from './icon.svg'
import iconWhiteSvg from './iconWhite.svg'

export function Header() {
  const { pathname } = useLocation()
  const darkMode = useRecoilValue(STATE.darkMode)

  return (
    <header>
      <div>
        <a href='https://mcontrol.ml' target='blank'>
          <img
            src={darkMode ? mcontrolWhiteSvg : mcontrolSvg}
            alt='MissionControl'
            className='logo__large'
          />
          <img
            src={darkMode ? iconWhiteSvg : iconSvg}
            alt='MissionControl'
            className='logo__small'
          />
        </a>
        <nav className='link__container'>
          <Link
            to={pathname.startsWith('/testnet') ? '/testnet' : '/mainnet'}
            className={
              pathname.startsWith('/mainnet') || pathname.startsWith('/testnet')
                ? 'link link__active'
                : 'link'
            }
          >
            <i className='bx bxs-network-chart' /> Explorer
          </Link>
          <Link
            to='/network/country'
            className={
              pathname.startsWith('/network')
                ? 'link link__active'
                : 'link'
            }
          >
            <i className='bx bx-globe' /> Network
          </Link>
          <Link
            to='/ibc'
            className={
              pathname.startsWith('/ibc') ? 'link link__active' : 'link'
            }
          >
            <i className='bx bxs-paper-plane'></i> IBC channels
          </Link>
          <Link
            to='/validators'
            className={
              pathname.startsWith('/validators') ? 'link link__active' : 'link'
            }
          >
            <i className='bx bxs-bar-chart-alt-2' /> Validators
          </Link>
        </nav>
      </div>

      <a href='https://github.com/mcontrolml/finder' target='blank' className='email'>
      <i className='bx bxl-github'></i> Contribute on GitHub!
      </a>
    </header>
  )
}
