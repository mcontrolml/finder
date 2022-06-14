import { Buffer } from 'buffer'
import { getIbcDenom } from '../../../../util/ibc'
import FormattedCoin from '../../components/coin/FormattedCoin'
import { AddressLink } from './AddressLink'

export default function IbcInfo(msg: any) {
  let sender = '',
    receiver = '',
    amount = '',
    denom = ''

  const isMsgTransfer =
    msg['@type'] === '/ibc.applications.transfer.v1.MsgTransfer'

  if (isMsgTransfer) {
    sender = msg.sender
    receiver = msg.receiver
    amount = msg.token.amount
    denom = msg.token.denom
  } else {
    const data = JSON.parse(
      Buffer.from(msg.packet.data, 'base64').toString('utf8'),
    )
    sender = data.sender
    receiver = data.receiver
    amount = data.amount
    denom = getIbcDenom(data.denom, msg.packet.destination_channel)
  }

  return (
    <div className='ibc__info'>
      <img
        className='ibc__logo'
        src='https://assets.terra.money/icon/svg/IBC.svg'
        alt='IBC'
      />{' '}
      <div>
        <h5>This is an IBC tx:</h5>
        <table>
          <tbody>
            <tr>
              <td className='tx__field'>from</td>
              <td style={{ wordBreak: 'break-all' }}>
                {isMsgTransfer ? (
                  <AddressLink
                    style={{ display: 'inline-flex' }}
                    address={sender}
                  />
                ) : (
                  sender
                )}
              </td>
            </tr>
            <tr>
              <td className='tx__field'>to</td>
              <td style={{ wordBreak: 'break-all' }}>
                {isMsgTransfer ? (
                  receiver
                ) : (
                  <AddressLink
                    style={{ display: 'inline-flex' }}
                    address={receiver}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td className='tx__field'>amount</td>
              <td>
                <FormattedCoin
                  style={{ display: 'inline-flex' }}
                  amount={amount}
                  denom={denom}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
