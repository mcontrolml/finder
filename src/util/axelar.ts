import axios from 'axios'

export function isAxelarTransfer(msg: any) {
  return (
    msg['@type'] === '/ibc.applications.transfer.v1.MsgTransfer' &&
    msg.source_channel === 'channel-6'
  )
}

export async function getAxelarInfo(depositAddress: string) {
  const { data } = await axios.get(
    `https://finder-api.mcontrol.ml/axelar/${depositAddress}`,
  )
  return data
}
