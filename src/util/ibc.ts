import axios from 'axios'
import NETWORKS from '../const/network'
import { IbcChannelInterface } from '../types/ibc'
import { sha256 } from 'js-sha256'

interface Channel {
  state: 'STATE_OPEN' | 'STATE_CLOSED'
  counterparty: {
    port_id: string
    channel_id: string
  }
  port_id: string
  channel_id: string
}

export async function getIbcChannels() {
  const [chains, list] = await Promise.all([
    (async () => {
      const { data } = await axios.get('https://assets.mcontrol.ml/chains.json')
      return data
    })(),
    (async () => {
      const { data } = await axios.get(
        `${NETWORKS.mainnet.LCD}/ibc/core/channel/v1/channels`,
      )
      return data
    })(),
  ])

  const result: Promise<IbcChannelInterface>[] = list.channels.map(
    async (channel: Channel) => {
      const { data: client } = await axios.get(
        `${NETWORKS.mainnet.LCD}/ibc/core/channel/v1/channels/${channel.channel_id}/ports/${channel.port_id}/client_state`,
      )

      const chainID = client.identified_client_state.client_state.chain_id

      return {
        active: channel.state === 'STATE_OPEN',
        chainID,
        channel: channel.channel_id,
        otherChannel: channel.counterparty.channel_id,
        client: client.identified_client_state.client_id,
        name: chains[chainID]?.name || chainID.split('-')[0],
        logo:
          chains[chainID]?.logo ||
          'https://assets.mcontrol.ml/coins/unknown.svg',
      }
    },
  )

  return await Promise.all(result)
}

export function isIbcTransfer(msg: any) {
  return (
    msg['@type'] === '/ibc.core.channel.v1.MsgRecvPacket' ||
    msg['@type'] === '/ibc.applications.transfer.v1.MsgTransfer'
  )
}

export function getIbcDenom(denom: string, channel: string) {
  return 'ibc/' + sha256(`transfer/${channel}/${denom}`).toUpperCase()
}
