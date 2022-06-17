import { useRecoilValue } from 'recoil'
import { formatBalance } from '../../../../util/balance'
import STATE from '../../../../state'

export default function FormattedCoin({
  amount,
  denom,
  rounded,
  style,
}: {
  amount: string
  denom: string
  rounded?: boolean
  style?: React.CSSProperties
}) {
  const assetList = useRecoilValue(STATE.assetList)

  const fixedDenom = denom.startsWith('ibc/') ? denom.substring(4) : denom

  return (
    <p
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        margin: 0,
        fontSize: 'small',
        ...style,
      }}
    >
      {formatBalance(amount, 6, rounded ? 0 : 6)}{' '}
      {assetList[fixedDenom] && (
        <img
          src={assetList[fixedDenom].icon}
          alt={assetList[fixedDenom].symbol}
          style={{ width: 16, padding: '0 .3rem' }}
        />
      )}
      {assetList[fixedDenom]?.symbol || denom}
    </p>
  )
}
