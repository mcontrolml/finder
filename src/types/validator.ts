export default interface ValidatorInterface {
  operator_address: string
  jailed: boolean
  status:
    | 'BOND_STATUS_UNBONDED'
    | 'BOND_STATUS_BONDED'
    | 'BOND_STATUS_UNBONDING'
  delegator_shares: string
  description: {
    moniker: string
    identity: string
    website: string
    details: string
    security_contact: string
  }
  unbonding_height: string
  unbonding_time: string
  commission: {
    commission_rates: {
      rate: string
      max_rate: string
      max_change_rate: string
    }
    update_time: string
  }
  min_self_delegation: string
  created_at: string
  picture: string
  self: string
}
