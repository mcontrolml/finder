import { useState } from 'react'

import './CopyButton.css'

export default function CopyButton({ value }: { value?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className='copy__button'
      onClick={() => {
        setCopied(true)
        navigator.clipboard.writeText(value || '')
        setTimeout(() => setCopied(false), 800)
      }}
    >
      {copied ? (
        <i className='bx bx-check'></i>
      ) : (
        <i className='bx bxs-copy'></i>
      )}
    </button>
  )
}
