import { useRecoilState, useSetRecoilState } from 'recoil'
import { useNavigate, useLocation } from 'react-router-dom'
import { matchPath } from 'react-router'

import STATE from '../../state'

import './TopToggle.css'
import { useEffect } from 'react'
import { getAssetList } from '../../util/assetList'
import { setTheme } from '../../util/theme'
import { getContractList } from '../../util/contractList'

export default function TopToggle() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useRecoilState(STATE.darkMode)
  const [net, setNetwork] = useRecoilState(STATE.network)
  const setAssetList = useSetRecoilState(STATE.assetList)
  const setContractList = useSetRecoilState(STATE.contractList)

  const result = matchPath('/:network/*', pathname)

  useEffect(() => {
    setTheme(localStorage.getItem('theme') === 'dark')
  }, [darkMode])

  useEffect(() => {
    if (['mainnet', 'testnet'].includes(result?.params.network || '')) {
      net !== result?.params.network &&
        setNetwork(result?.params.network as 'mainnet' | 'testnet')
    } else if (
      result?.params.network &&
      !['validators', 'ibc', 'network', 'endpoints'].includes(
        result?.params.network || '',
      )
    ) {
      navigate('/mainnet')
    }
    // eslint-disable-next-line
  }, [result])

  useEffect(() => {
    ;(async () => {
      const assetList = await getAssetList(net)
      setAssetList(assetList)
      const contractList = await getContractList(net, assetList)
      setContractList(contractList)
    })()
  }, [net, setAssetList, setContractList])

  return (
    <div className='top__toggle'>
      {['mainnet', 'testnet'].includes(result?.params.network || '') && (
        <button
          className='network__toggle'
          onClick={() => {
            setNetwork(net === 'mainnet' ? 'testnet' : 'mainnet')
            if (result) {
              navigate(
                `/${
                  net === 'mainnet' ? 'testnet' : 'mainnet'
                }${result.pathname.substring(result.pathnameBase.length)}`,
              )
            }
          }}
        >
          {net}
        </button>
      )}
      <button
        className='darkmode__toggle'
        onClick={() => {
          localStorage.setItem('theme', darkMode ? 'light' : 'dark')
          setDarkMode(!darkMode)
        }}
      >
        <i className={darkMode ? 'bx bxs-moon' : 'bx bxs-sun'}></i>
      </button>
    </div>
  )
}
