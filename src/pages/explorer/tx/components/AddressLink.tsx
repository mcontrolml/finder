import { useRecoilValue } from 'recoil'
import { Link } from 'react-router-dom'
import STATE from '../../../../state'

export function AddressLink({
  address,
  style,
}: {
  address: string
  style?: React.CSSProperties
}) {
  const network = useRecoilValue(STATE.network)
  const contractList = useRecoilValue(STATE.contractList)

  return (
    <Link
      className='address__link'
      to={`/${network}/wallet/${address}`}
      style={style}
    >
      {contractList[address] ? (
        <>
          {contractList[address].icon && (
            <img
              src={contractList[address].icon}
              alt={contractList[address].name}
            />
          )}
          {contractList[address].name}
        </>
      ) : (
        `terra1...${address.substring(address.length - 10)}`
      )}
    </Link>
  )
}
