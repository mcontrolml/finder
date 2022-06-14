import { getAxelarInfo } from '../../../../util/axelar'
import { AddressLink } from './AddressLink'
import { useEffect, useState } from 'react'
import FormattedCoin from '../../components/coin/FormattedCoin'

interface AxelarData {
  denom: string
  amount: string
  from: string
  to: string
  chain: string
}

export default function AxelarInfo(msg: any) {
  const [data, setData] = useState<AxelarData | undefined>()
  const isMsgTransfer =
    msg['@type'] === '/ibc.applications.transfer.v1.MsgTransfer'

  useEffect(() => {
    ;(async () => {
      if (isMsgTransfer) {
        const result = await getAxelarInfo(msg.receiver)
        setData({
          from: msg.sender,
          to: result.recipient_address,
          chain: result.recipient_chain,
          amount: msg.token.amount,
          denom: msg.token.denom,
        })
      }
    })()
  }, [msg, isMsgTransfer])

  return data ? (
    <div className='ibc__info'>
      <img
        className='ibc__logo'
        src='https://assets.mcontrol.ml/coins/AXELAR.svg'
        alt='Axelar'
      />{' '}
      <div>
        <h5>This is an Axelar transfer:</h5>
        <table>
          <tbody>
            <tr>
              <td className='tx__field'>from</td>
              <td style={{ wordBreak: 'break-all' }}>
                {isMsgTransfer ? (
                  <AddressLink
                    style={{ display: 'inline-flex' }}
                    address={data.from}
                  />
                ) : (
                  'tbd'
                )}
              </td>
            </tr>
            <tr>
              <td className='tx__field'>to</td>
              <td style={{ wordBreak: 'break-all' }}>{isMsgTransfer ? data.to : 'tbd'}</td>
            </tr>
            <tr>
              <td className='tx__field'>chain</td>
              <td>
                {data.chain}
              </td>
            </tr>
            <tr>
              <td className='tx__field'>amount</td>
              <td>
                <FormattedCoin
                  style={{ display: 'inline-flex' }}
                  amount={data.amount}
                  denom={data.denom}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <></>
  )
}
