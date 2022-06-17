import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Link } from 'react-router-dom'
import axios from 'axios'

import STATE from '../../../../state'
import NETWORKS from '../../../../const/network'

import './ValidatorLink.css'
import ValidatorInterface from '../../../../types/validator'

export default function ValidatorLink({ address }: { address: string }) {
  const network = useRecoilValue(STATE.network)
  const [validator, setValidator] = useState<ValidatorInterface | undefined>()

  useEffect(() => {
    if (network !== 'mainnet' && network !== 'testnet') return
    ;(async () => {
      const { data } = await axios.get(
        `${NETWORKS[network].api}/validator/${address}`,
      )
      setValidator(data)
    })()
  }, [address, network])

  return validator ? (
    <Link className='validator__link' to={`/${network}/validator/${address}`}>
      {validator.picture && (
        <img src={validator.picture} alt={validator.description.moniker} />
      )}
      {validator.description.moniker}
    </Link>
  ) : (
    <Link className='validator__link' to={`/${network}/validator/${address}`}>
      terravaloper1...{address.substring(address.length - 8)}
    </Link>
  )
}
