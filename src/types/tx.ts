interface SingleSignInterface {
  single: {
    mode: 'SIGN_MODE_LEGACY_AMINO_JSON' | 'SIGN_MODE_DIRECT'
  }
}

interface MultiSignInterface {
  multi: {
    mode_infos: (SingleSignInterface | MultiSignInterface)[]
  }
}

export interface TxInterface {
  tx: {
    body: {
      messages: any[]
      memo: string
    }
    auth_info: {
      signer_infos: [
        {
          mode_info: SingleSignInterface | MultiSignInterface
          sequence: string
        }
      ]
      fee: {
        amount: {
          denom: string
          amount: string
        }[]
        gas_limit: string
      }
    }
  }
  tx_response: {
    height: string
    txhash: string
    code: number
    raw_log: string
    gas_wanted: string
    gas_used: string
    timestamp: string
    tx: FcdTxInterface
  }
}

export interface FcdTxInterface {
  height: string
  txhash: string
  code: number
  raw_log: string
  gas_wanted: string
  gas_used: string
  tx: {
    body: {
      messages: any[]
      memo: string
      timeout_height: string
      extension_options: []
      non_critical_extension_options: []
    }
    auth_info: {
      signer_infos: [
        {
          mode_info: SingleSignInterface | MultiSignInterface
          sequence: string
        },
      ]
      fee: {
        amount: {
          denom: string
          amount: string
        }[]
        gas_limit: string
      }
    }
  }
  timestamp: string
  events: any[]
}
