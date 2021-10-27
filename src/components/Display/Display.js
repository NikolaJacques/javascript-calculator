import { useContext } from 'react'
import { GeneralContext } from '../Context'
import './Display.scss'

export default function Display() {
    
    const { current, expression } = useContext(GeneralContext)

    return (
        <div className="display">
            <div className="expression">{expression}</div>
            <div className="current">{current}</div>
        </div>
    )
}
