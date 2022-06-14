import { useState } from 'react'
import { isAxelarTransfer } from '../../../util/axelar'
import { isIbcTransfer } from '../../../util/ibc'
import FormattedCoin from '../components/coin/FormattedCoin'
import ValidatorLink from '../components/validatorLink/ValidatorLink'
import { AddressLink } from './components/AddressLink'
import AxelarInfo from './components/AxelarInfo'
import IbcInfo from './components/IbcInfo'

function LargeField({ value }: { value: string }) {
  const [isOpen, setOpen] = useState(value.length < 90)

  return (
    <td style={{ wordBreak: 'break-all' }}>
      {isOpen ? value : `${value.substring(0, 80)}...`}{' '}
      {value.length >= 90 && (
        <button
          className='tx__showmore'
          onClick={() => {
            setOpen(!isOpen)
          }}
        >
          Show {isOpen ? 'less' : 'more'}
        </button>
      )}
    </td>
  )
}

export default function TxMsg(msg: any) {
  const msgType = msg['@type'].split('.')
  const msgName = msgType[msgType.length - 1] || msg['@type']
  return (
    <div className='msg'>
      {
        isIbcTransfer(msg) && (isAxelarTransfer(msg) ? <AxelarInfo {...msg} /> : <IbcInfo {...msg}/>)
      }
      <h5>{msgName}</h5>
      <table>
        <tbody>
          {Object.keys(msg).map((key) => {
            const val = msg[key]

            if(!val) return <></>

            // execute msg, will be putted outside of the table
            if (
              key === '@type' ||
              (msg['@type'] === '/cosmwasm.wasm.v1.MsgExecuteContract' &&
                key === 'msg')
            )
              return <></>

            // coin
            if (val.denom && val.amount) {
              return (
                <tr key={key}>
                  <td className='tx__field'>{key}</td>
                  <td>
                    <FormattedCoin {...val} />
                  </td>
                </tr>
              )
            }
            // array of coin
            if (Array.isArray(val) && val[0] && val[0].denom && val[0].amount) {
              return (
                <tr key={key}>
                  <td className='tx__field'>{key}</td>
                  <td>
                    {val.map((coin: any, i: number) => (
                      <div key={i}>
                        <FormattedCoin key={coin.denom} {...coin} />
                      </div>
                    ))}
                  </td>
                </tr>
              )
            }
            // address
            if (typeof val === 'string' && /(terra1[a-z0-9]{38})/g.test(val)) {
              return (
                <tr key={key}>
                  <td className='tx__field'>{key}</td>
                  <td>
                    <AddressLink address={val} />
                  </td>
                </tr>
              )
            }
            // validator
            if (
              typeof val === 'string' &&
              /(terravaloper1[a-z0-9]{38})/g.test(val)
            ) {
              return (
                <tr key={key}>
                  <td className='tx__field'>{key}</td>
                  <td>
                    <ValidatorLink address={val} />
                  </td>
                </tr>
              )
            }

            // timestamp
            if (key.includes('timestamp')) {
              return (
                <tr key={key}>
                  <td className='tx__field'>{key}</td>
                  <td>
                    {new Date(parseInt(val) / 1_000_000).toLocaleString()}
                  </td>
                </tr>
              )
            }

            // text field
            return (
              <tr key={key}>
                <td className='tx__field'>{key}</td>
                <LargeField
                  value={
                    typeof val === 'object' ? JSON.stringify(val, null, 2) : val
                  }
                />
              </tr>
            )
          })}
        </tbody>
      </table>
      {msg['@type'] === '/cosmwasm.wasm.v1.MsgExecuteContract' && msg['msg'] && (
        <div className='execute__msg'>
          <span className='tx__field'>msg</span>
          <code>
            <pre>{JSON.stringify(msg['msg'], null, 2)}</pre>
          </code>
        </div>
      )}
    </div>
  )
}
