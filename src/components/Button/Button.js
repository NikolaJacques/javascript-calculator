import { useContext } from 'react'
import { GeneralContext } from '../Context'
import './Button.scss'

export default function Button({className, label}) {

    const { handleChange } = useContext(GeneralContext)
    
    return (
        <button className={className} onClick={(e) => handleChange(e)}>
            {label}
        </button>
    )
}
