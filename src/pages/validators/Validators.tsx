import { useState, useEffect } from 'react'
import axios from 'axios'

import { ValidatorInterface } from '../../types/validator'

import { Loading } from '../../components/loading/Loading'

import './Validator.css'
import NETWORKS from '../../const/network'
import Banner from '../../components/banner/Banner'
import MobileLogo from '../../components/logo/MobileLogo'
import { getStakingInfo } from '../../util/staking'
import { Link } from 'react-router-dom'

interface StakingInfo {
  totalSupply?: number
  staked?: number
  return?: number
}

export default function Validator() {
  const [loading, setLoading] = useState(true)
  const [staking, setStaking] = useState<StakingInfo>({})
  const [validators, setValidators] = useState<ValidatorInterface[]>([])

  useEffect(() => {
    ;(async () => {
      const [stakingData, validators] = await Promise.all([
        getStakingInfo(),
        (async () => {
          const { data } = await axios.get(`${NETWORKS.mainnet.api}/validators`)
          return data
        })(),
      ])
      setValidators(validators)
      setStaking(stakingData)
      setLoading(false)
    })()
  }, [])

  return (
    <main className='content'>
      <MobileLogo />
      <h1>Validators metrics</h1>

      <Banner small />

      <div className='content__box'>
        <h3>Staking details</h3>
        {loading ? (
          <Loading />
        ) : (
          <div className='staking__apy'>
            <h1>{((staking.return || 0) * 100).toFixed(2)} %</h1>
            <p>Annual return</p>
            <div className='staking__supply'>
              <div className='centered__container'>
                <h2>
                  {(staking.staked || 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </h2>{' '}
                <img
                  src='https://assets.mcontrol.ml/coins/LUNA.svg'
                  alt='Luna'
                />{' '}
                <h2>Luna</h2>
              </div>
              <p>Staked</p>
            </div>
            <div className='staking__supply'>
              <div className='centered__container'>
                <h2>
                  {(staking.totalSupply || 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </h2>{' '}
                <img
                  src='https://assets.mcontrol.ml/coins/LUNA.svg'
                  alt='Luna'
                />{' '}
                <h2>Luna</h2>
              </div>
              <p>Total supply</p>
            </div>
          </div>
        )}
      </div>

      <div className='content__box'>
        <div className='flex__space'>
          <h3>Validators</h3> <h5>Status</h5>
        </div>
        <div className='warning' style={{ marginTop: 0 }}>
          <h4>
            <i className='bx bxs-info-circle'></i> Info
          </h4>
          <p>We are working to add more validators metrics, stay tuned!</p>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className='validators__list'>
            {validators.map((validator) => {
              const moniker = validator.description.moniker
              return (
                <div
                  className='validator flex__space'
                  key={validator.operator_address}
                >
                  <Link
                    to={`/mainnet/validator/${validator.operator_address}`}
                    className='validator__name'
                  >
                    <img
                      src={
                        validator.picture ||
                        'https://assets.mcontrol.ml/coins/TERRA.svg'
                      }
                      alt={moniker}
                    />
                    <h5>
                      {moniker.length > 16
                        ? `${moniker.substring(0, 14)}...`
                        : moniker}
                    </h5>
                  </Link>
                  {validator.jailed ? (
                    <p className='validator__jailed'>Jailed</p>
                  ) : (
                    <p className='validator__active'>Active</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
