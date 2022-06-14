import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import NETWORKS from '../../../const/network'

import { TxInterface } from '../../../types/tx'
import TxMsg from './TxMsg'
import { Loading } from '../../../components/loading/Loading'
import FormattedCoin from '../components/coin/FormattedCoin'
import Search from '../../../components/search/Search'
import CopyButton from '../components/copy/CopyButton'

import './Tx.css'
import MobileLogo from '../../../components/logo/MobileLogo'
import { timeToRelative } from '../../../util/time'

function formatHash(hash: string): string {
  return hash.substring(0, 14) + '...' + hash.substring(hash.length - 14)
}

export default function Tx() {
  const { txhash, network } = useParams()

  const [tx, setTx] = useState<TxInterface | undefined>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (network !== 'mainnet' && network !== 'testnet') return
    ;(async () => {
      const { data } = await axios.get(
        `${NETWORKS[network].LCD}/cosmos/tx/v1beta1/txs/${txhash}`,
      )
      setTx(data as TxInterface)
      setLoading(false)
    })()
  }, [txhash, network])

  const signature = tx && tx.tx.auth_info.signer_infos[0].mode_info

  return (
    <main className='content tx'>
      <MobileLogo />
      <h1>Block Explorer</h1>
      <Search />

      <div className='content__box'>
        <h3>Transaction</h3>
        {isLoading || !tx || !signature ? (
          <Loading />
        ) : (
          <>
            <p>
              <span
                className={tx.tx_response.code ? 'tx__error' : 'tx__success'}
              >
                {tx.tx_response.code ? 'Error' : 'Success'}
              </span>{' '}
              <span className='tx__date'>
                {new Date(tx.tx_response.timestamp).toLocaleString()}
              </span>
              <span className='tx__date'>|</span>
              <span className='tx__date'>
                {timeToRelative(new Date(tx.tx_response.timestamp))}
              </span>
            </p>
            <p>
              {formatHash(txhash as string)} <CopyButton value={txhash} />
            </p>
            <table>
              <tbody>
                <tr>
                  <td className='tx__field'>Block</td>
                  <td>{tx.tx_response.height}</td>
                </tr>
                <tr>
                  <td className='tx__field'>Memo</td>
                  <td style={{ wordBreak: 'break-all' }}>
                    {tx.tx.body.memo || '-'}
                  </td>
                </tr>
                <tr>
                  <td className='tx__field'>Transaction fee</td>
                  <td>
                    <FormattedCoin {...tx.tx.auth_info.fee.amount[0]} />
                  </td>
                </tr>
                <tr>
                  <td className='tx__field'>Gas (Used/Wanted)</td>
                  <td>
                    {tx.tx_response.gas_used}/{tx.tx_response.gas_wanted}
                  </td>
                </tr>
              </tbody>
            </table>

            {!!tx.tx_response.code && (
              <div className='tx__error__log'>
                <p>{tx.tx_response.raw_log}</p>
              </div>
            )}

            <div className='tx__signmode'>
              {'single' in signature ? (
                signature.single.mode !== 'SIGN_MODE_LEGACY_AMINO_JSON' ? (
                  <>
                    <i className='bx bxs-shield-x'></i>This transaction was not
                    signed with a Hardware wallet
                  </>
                ) : (
                  <>
                    <i className='bx bxs-check-shield'></i> This transaction was
                    likely signed with a Hardware wallet
                  </>
                )
              ) : (
                <>
                  <i className='bx bxs-check-shield'></i> This is a multisig tx.
                  <br />
                  {
                    signature.multi.mode_infos.filter(
                      (sig) =>
                        'single' in sig &&
                        sig.single.mode === 'SIGN_MODE_LEGACY_AMINO_JSON',
                    ).length
                  }
                  /{signature.multi.mode_infos.length} signers has likely used a
                  hardware wallet for this transaction.
                </>
              )}
            </div>
          </>
        )}
      </div>
      {!isLoading && tx && (
        <>
          {' '}
          <div className='content__box'>
            <h3>Tx Msgs</h3>
            {tx.tx.body.messages.length === 0 ? (
              <p>This tx doesn't have any msg</p>
            ) : (
              tx.tx.body.messages.map((msg: any, i: number) => (
                <TxMsg key={i} {...msg} />
              ))
            )}
          </div>
        </>
      )}
    </main>
  )
}
