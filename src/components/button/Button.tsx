import './Button.css'

interface ButtonProps {
  href?: string
  onClick?: () => void
  children?: (JSX.Element | string)[] | JSX.Element | string
}

export default function Button({ onClick, children, href }: ButtonProps) {
  return href ? (
    <a href={href} className='button' target='blank'>
      {children}
    </a>
  ) : (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  )
}
