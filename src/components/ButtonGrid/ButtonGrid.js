import React from 'react'
import './ButtonGrid.scss'
import Button from '../Button/Button'
import { ButtonObject } from '../ButtonObject'

export default function ButtonGrid() {
    return (
        <div className="button-grid">
            {ButtonObject.map(({label, className}) => <Button label={label} className={className} key={className}/>)}
        </div>
    )
}
