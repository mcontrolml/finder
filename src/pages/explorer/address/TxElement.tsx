import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import STATE from '../../../state'
import { timeToRelative } from '../../../util/time'
import { FcdTxInterface } from '../../../types/tx'

export default function TxElement({ code, txhash, tx, timestamp }: FcdTxInterface) {
  const network = useRecoilValue(STATE.network)

  const msgs: string[] = (tx as any).body.messages.map((msg: any) => {
    const type = msg['@type'].split('.')
    return type[type.length - 1]
  })

  return (
    <tr className='txhistory__tx'>

      <td>
        {code ? (
          <span className='txhistory__error'>
            <i className='bx bx-x'></i>
          </span>
        ) : (
          <span className='txhistory__success'>
            <i className='bx bx-check'></i>
          </span>
        )}
      </td>
      <td className='txhistory__messages'>
        {msgs.map((msg, i) => (
          <span key={i}>{msg}</span>
        ))}
      </td>
      <td className='txhistory__time'>
        {timeToRelative(new Date(timestamp))}
      </td>
      <td>
        <Link to={`/${network}/tx/${txhash}`}><i className='bx bx-link-external' ></i></Link>
      </td>
    </tr>
  )
}
