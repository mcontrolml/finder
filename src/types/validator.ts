enum VoteOption {
  yes = 'VOTE_OPTION_YES',
  abstain = 'VOTE_OPTION_ABSTAIN',
  noWithVeto = 'VOTE_OPTION_NO_WITH_VETO',
  no = 'VOTE_OPTION_NO',
}

export const VOTES: Record<VoteOption, string> = {
  [VoteOption.yes]: 'Yes',
  [VoteOption.abstain]: 'Abstain',
  [VoteOption.noWithVeto]: 'No with veto',
  [VoteOption.no]: 'No',
}

interface VoteInterface {
  proposal_id: string
  options: {
    option: VoteOption
    weight: string
  }[]
  title: string
}

export interface ValidatorInterface {
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
  votes: VoteInterface[]
}
