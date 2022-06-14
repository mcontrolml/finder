import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import STATE from '../../../state'
import NETWORKS from '../../../const/network'

import {
  BalanceInterface,
  ContractInterface,
  DelegationInterface,
  UndelegationInterface,
} from '../../../types/wallet'
import { FcdTxInterface } from '../../../types/tx'

import './Address.css'
import { Loading } from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'
import Search from '../../../components/search/Search'

import CoinBalance from './CoinBalance'
import Delegation from './Delegation'
import TxElement from './TxElement'
import Banner from '../../../components/banner/Banner'
import MobileLogo from '../../../components/logo/MobileLogo'
import { getCW20Balance } from '../../../util/CW20'
import { AddressLink } from '../tx/components/AddressLink'

export default function Address() {
  const { address, network } = useParams()
  const assetList = useRecoilValue(STATE.assetList)
  const contractList = useRecoilValue(STATE.contractList)
  const [contract, setContract] = useState<ContractInterface | undefined>()
  const [balance, setBalance] = useState<BalanceInterface[]>([])
  const [vesting, setVesting] = useState<number>(0)
  const [tokenBalance, setTokenBalance] = useState<BalanceInterface[]>([])
  const [delegations, setDelegations] = useState<DelegationInterface[]>([])
  const [undelegations, setUndelegations] = useState<UndelegationInterface[]>(
    [],
  )
  const [history, setHistory] = useState<{
    next?: string
    txs: FcdTxInterface[]
  }>({ next: '0', txs: [] })
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    if (network !== 'mainnet' && network !== 'testnet') return
    ;(async () => {
      const [
        vestingLuna,
        contract,
        balances,
        cw20balances,
        delegations,
        unbonding,
        validators,
        txs,
      ] = await Promise.all([
        (async () => {
          // not an address
          if (!address?.length || address.length > 44) return
          const {
            data: { account },
          } = await axios.get(
            `${NETWORKS[network].LCD}/cosmos/auth/v1beta1/accounts/${address}`,
          )

          if (
            account['@type'] !==
            '/cosmos.vesting.v1beta1.PeriodicVestingAccount'
          )
            return 0

          return parseInt(
            account.base_vesting_account.original_vesting[0].amount,
          )
        })().catch(() => 0),
        (async () => {
          // not a contract
          if (!address?.length || address.length < 64) return
          const {
            data: { contract_info },
          } = await axios.get(
            `${NETWORKS[network].LCD}/cosmwasm/wasm/v1/contract/${address}`,
          )
          const {
            data: { entries },
          } = await axios.get(
            `${NETWORKS[network].LCD}/cosmwasm/wasm/v1/contract/${address}/history`,
          )

          return { ...contract_info, msg: entries[0].msg }
        })().catch(() => {}),
        (async () => {
          const {
            data: { balances },
          } = await axios.get(
            `${NETWORKS[network].LCD}/cosmos/bank/v1beta1/balances/${address}`,
          )
          return balances
        })(),
        (async () => {
          const bal = await getCW20Balance(
            address || '',
            Object.keys(assetList).filter((c) => c.startsWith('terra1')),
            network,
          )
          return Object.keys(bal).map((denom) => {
            return {
              denom,
              amount: bal[denom],
              ...assetList[denom],
            }
          })
        })(),
        (async () => {
          const {
            data: { delegation_responses },
          } = await axios.get(
            `${NETWORKS[network].LCD}/cosmos/staking/v1beta1/delegations/${address}`,
          )
          return delegation_responses
        })(),
        (async () => {
          const {
            data: { unbonding_responses },
          } = await axios.get(
            `${NETWORKS[network].LCD}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`,
          )
          return unbonding_responses
        })(),
        (async () => {
          const { data } = await axios.get(
            `${NETWORKS[network].api}/validators`,
          )
          return data
        })(),
        (async () => {
          const { data } = await axios.get(
            `${NETWORKS[network].FCD}/v1/txs?offset=0&limit=10&account=${address}`,
          )
          return data
        })(),
      ])

      const formattedDelegations = delegations.map(
        (delegation: any): DelegationInterface => {
          const validator_address = delegation.delegation.validator_address

          const validator = validators.find(
            (validator: any) =>
              validator.operator_address === validator_address,
          )

          return {
            validator_address,
            amount: delegation.balance.amount,
            moniker: validator.description.moniker,
            icon: validator.picture,
            jailed: validator.jailed,
          }
        },
      )

      const formattedUndelegations: UndelegationInterface[] = []

      unbonding.forEach((entry: any) => {
        const validator_address = entry.validator_address

        const validator = validators.find(
          (validator: any) => validator.operator_address === validator_address,
        )

        entry.entries.forEach((undelegation: any) => {
          formattedUndelegations.push({
            validator_address,
            amount: undelegation.balance,
            moniker: validator.description.moniker,
            icon: validator.picture,
            jailed: validator.jailed,
            completion_time: new Date(undelegation.completion_time),
          })
        })
      })

      setVesting(vestingLuna || 0)
      setContract(contract)
      setHistory(txs)
      setUndelegations(formattedUndelegations)
      setDelegations(formattedDelegations)
      setTokenBalance(cw20balances)
      setBalance(balances)
      setLoading(false)
    })()
  }, [address, network, assetList])
  return (
    <main className='content'>
      <MobileLogo />
      <h1>Block Explorer</h1>
      <Search />

      <div className='content__box'>
        <h3>Address</h3>
        {!isLoading && contractList[address || ''] && (
          <div className='contract__name'>
            {contractList[address || ''].icon && (
              <img
                src={contractList[address || ''].icon}
                alt={contractList[address || ''].name}
              />
            )}
            <span>{contractList[address || ''].name}</span>
          </div>
        )}
        <p className='address__text' style={{ wordBreak: 'break-all' }}>
          {address}
        </p>

        <div className='address__buttons'>
          <Button onClick={() => navigator.clipboard.writeText(address || '')}>
            <i className='bx bxs-copy'></i> Copy
          </Button>
          {/*
          <Button>
            <i className='bx bx-qr-scan'></i> Show QR
          </Button>
          */}
        </div>
      </div>

      {!isLoading && contract && (
        <div className='content__box contract__details'>
          <h3>Contract</h3>
          <div>
            <table>
              <tbody>
                <tr>
                  <td className='field__title'>Code ID</td>
                  <td>{contract.code_id}</td>
                </tr>
                <tr>
                  <td className='field__title'>Label</td>
                  <td>{contract.label}</td>
                </tr>
                {contract.admin && (
                  <tr>
                    <td className='field__title'>Admin</td>
                    <td>
                      <AddressLink address={contract.admin} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className='execute__msg'>
              <span className='field__title'>InitMsg</span>
              <code>
                <pre>{JSON.stringify(contract.msg, null, 2)}</pre>
              </code>
            </div>
          </div>
        </div>
      )}

      <Banner small />

      <div className='content__box'>
        <h3>Coins</h3>
        {isLoading ? (
          <Loading />
        ) : (
          balance.map((bal) => (
            <CoinBalance
              key={bal.denom}
              {...bal}
              {...assetList[
                bal.denom.startsWith('ibc/')
                  ? bal.denom.substring(4)
                  : bal.denom
              ]}
              vesting={bal.denom === 'uluna' ? vesting : undefined}
            />
          ))
        )}
      </div>

      {!isLoading && tokenBalance.length > 0 && (
        <div className='content__box'>
          <h3>Tokens</h3>
          {tokenBalance.map((bal) => (
            <CoinBalance key={bal.denom} {...bal} {...assetList[bal.denom]} />
          ))}
        </div>
      )}

      {!isLoading && delegations.length > 0 && (
        <div className='content__box'>
          <h3>Delegations</h3>
          {isLoading ? (
            <Loading />
          ) : (
            delegations.map((delegation: DelegationInterface) => (
              <Delegation key={delegation.validator_address} {...delegation} />
            ))
          )}
        </div>
      )}

      {!isLoading && undelegations.length > 0 && (
        <div className='content__box'>
          <h3>Undelegations</h3>
          {isLoading ? (
            <Loading />
          ) : (
            undelegations.map((delegation: UndelegationInterface) => (
              <Delegation key={delegation.validator_address} {...delegation} />
            ))
          )}
        </div>
      )}

      <div className='content__box'>
        <h3>Tx History</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <table className='tx__history'>
            <tbody>
              {history.txs.map((tx) => (
                <TxElement key={tx.txhash} {...tx} />
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && history.next && (
          <button
            onClick={async () => {
              const { data } = await axios.get(
                `${
                  NETWORKS[network as 'mainnet' | 'testnet'].FCD
                }/v1/txs?offset=${history.next}&limit=10&account=${address}`,
              )
              setHistory({
                txs: history.txs.concat(data.txs),
                next: data.next,
              })
            }}
            className='txhistory__load'
          >
            Load more
          </button>
        )}
      </div>
    </main>
  )
}
