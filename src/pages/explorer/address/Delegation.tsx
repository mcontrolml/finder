import { useParams, Link } from 'react-router-dom'
import { DelegationInterface } from '../../../types/wallet'
import { formatBalance } from '../../../util/balance'

export interface UndelegationInterface extends DelegationInterface {
  completion_time?: Date
}

export default function Delegation({
  moniker,
  amount,
  icon,
  jailed,
  validator_address,
  completion_time,
}: UndelegationInterface) {
  const { network } = useParams()
  return (
    <div className='delegation'>
      <div className='coin__balance__details'>
        <img src={icon} alt={icon} className='validator__img' />
        <div>
          <Link
            to={`/${network}/validator/${validator_address}`}
            className='delegation__name'
          >
            {moniker}{' '}
            <span
              className={jailed ? 'delegation__error' : 'delegation__success'}
            >
              {jailed ? 'Jailed' : 'Active'}
            </span>
          </Link>
          {completion_time && (
            <p className='release__time'>
              Release: {completion_time.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <span className='coin__balance__amount'>
        {formatBalance(amount)} Luna
      </span>
    </div>
  )
}
