import { formatBalance } from '../../../util/balance'
import { BalanceInterface } from '../../../types/wallet'

interface Coin extends BalanceInterface {
  vesting?: number
}

export default function CoinBalance({
  denom,
  amount,
  symbol,
  icon,
  name,
  decimals,
  vesting,
}: Coin) {
  return (
    <div className='coin'>
      <div className='coin__balance'>
        <div className='coin__balance__details'>
          <img src={icon} alt={symbol} />
          <div>
            <span className='coin__balance__name'>{symbol}</span>
            <span className='coin__balance__denom'>{name}</span>
          </div>
        </div>
        <span className='coin__balance__amount'>
          {formatBalance(amount, decimals)}
        </span>
      </div>
      {!!vesting && (
        <p className='coin__balance__vesting'>
          Vesting: {formatBalance(vesting.toFixed(0), 6, 0)} {symbol}
        </p>
      )}
    </div>
  )
}
