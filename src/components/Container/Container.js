import React from 'react'
import ButtonGrid from '../ButtonGrid/ButtonGrid'
import Display from '../Display/Display'
import './Container.scss'

export default function Container() {
    return (
        <div className="container">
            <Display />
            <ButtonGrid />
        </div>
    )
}
