import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'

import axios from 'axios'

import './Validator.css'
import ValidatorInterface from '../../../types/validator'
import { Loading } from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'
import Search from '../../../components/search/Search'

import { convertAddr } from '../../../util/bach32'
import NETWORKS from '../../../const/network'
import MobileLogo from '../../../components/logo/MobileLogo'
import { timeToRelative } from '../../../util/time'
import FormattedCoin from '../components/coin/FormattedCoin'

export default function Validator() {
  const { address, network } = useParams()

  const [isLoading, setLoading] = useState(true)
  const [validatorData, setValidator] = useState<
    ValidatorInterface | undefined
  >()

  useEffect(() => {
    setLoading(true)
    if (network !== 'mainnet' && network !== 'testnet') return
    ;(async () => {
      const { data } = await axios.get(
        `${NETWORKS[network].api}/validator/${address}`,
      )
      setValidator(data)
      setLoading(false)
    })()
  }, [address, network])

  if (!isLoading && !validatorData) {
    // TODO: 404 page
    return <Navigate to={`/${network}`} replace={true} />
  }

  const validator = validatorData as ValidatorInterface
  const selfDelegationAddr = isLoading
    ? ''
    : convertAddr(validator.operator_address, 'terra')

  return (
    <main className='content'>
      <MobileLogo />
      <h1>Block Explorer</h1>
      <Search />

      <div className='content__box'>
        <h3>Validator</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <div className='validator__details'>
            <div className='flex__space'>
              <div className='validator__details__img'>
                <img
                  src={validator.picture || 'https://assets.mcontrol.ml/coins/TERRA.svg'}
                  alt={validator.description.moniker}
                />
                <div>
                  <h4>{validator.description.moniker}</h4>
                  {validator.description.website && (
                    <a href={validator.description.website} target='blank'>
                      {validator.description.website}
                    </a>
                  )}
                </div>
              </div>
              {validator.jailed ? <p className='validator__jailed'>Jailed</p> : <p className='validator__active'>Active</p>}

            </div>
            <p>{validator.description.details}</p>
            <h5>Voting power:</h5>
            <p className='validator__staked'><FormattedCoin rounded amount={validator.delegator_shares.split('.')[0]} denom='uluna' /></p>
            <h5>Self delegation address:</h5>
            <Link to={`/${network}/wallet/${selfDelegationAddr}`}>
              {selfDelegationAddr}
            </Link>
            <h5>Operator address:</h5>
            <p>{address}</p>
            <div className='flex__left'>
              <Button href={`https://station.terra.money/validator/${address}`}>
                Delegate
              </Button>
              {validator.description.security_contact && (
                <Button
                  href={`mailto:${validator.description.security_contact}`}
                >
                  Contact
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='content__box'>
        <h3>Commissions</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className='flex__space'>
              <div className='commission__detail'>
                <h4>Current</h4>
                <p>
                  {Math.round(
                    parseFloat(validator.commission.commission_rates.rate) *
                      100,
                  )}{' '}
                  %
                </p>
              </div>
              <div className='commission__detail'>
                <h4>Last changed</h4>
                <p>
                  {timeToRelative(new Date(validator.commission.update_time))}
                </p>
              </div>
            </div>
            <div className='flex__space'>
              <div className='commission__detail'>
                <h4>Max daily change</h4>
                <p>
                  {Math.round(
                    parseFloat(
                      validator.commission.commission_rates.max_change_rate,
                    ) * 100,
                  )}{' '}
                  %
                </p>
              </div>
              <div className='commission__detail'>
                <h4>Max</h4>
                <p>
                  {Math.round(
                    parseFloat(validator.commission.commission_rates.max_rate) *
                      100,
                  )}{' '}
                  %
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className='content__box'>
        <h3>Uptime</h3>
      </div>

      <div className='content__box'>
        <h3>Governance partecipation</h3>
      </div>

      <div className='content__box'>
        <h3>Delegations</h3>
      </div>
    </main>
  )
}
