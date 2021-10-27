import { createContext, useState } from 'react'
import { API } from './API'

export const GeneralContext = createContext()

export default function Context(props) {

    const [expression, setExpression] = useState('')
    const [current, setCurrent] = useState('')
    const [endCondition, setEndCondition] = useState(false)

    const handleChange = (e) => {
        if(endCondition){ 
            setExpression(() => {return current})
        }
        const input = e.target.innerText
        const lastCharacter = current[current.length-1]===undefined?'':current[current.length-1]
        switch(input) {
            case '.':
                endConditionDecorator(dotHandler(lastCharacter, input))
                return
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                endConditionDecorator(valueHandler(lastCharacter, input))
                return
            case '-':
                endConditionDecorator(subtractHandler(lastCharacter, input))
                return
            case'/':
            case '*':
            case '+':
                operandHandler(lastCharacter, input)
                if(endCondition){setEndCondition(() => {return false})}
                return
            case 'AC':
                resetValues()
                return
            case '=':
                endConditionDecorator(equalsHandler())
                return
            default:
                return
        }
    }

    const isValue = (character) => {
        return character.search(/[0-9]/)!==-1
    } 

    const isOperand = (character) => {
        return character.search(/\/|\*|-|\+/)!==-1
    }

    const chaseValues = (input) => {
        setExpression(prevValue => prevValue  + input)
        setCurrent(input)
    }

    const appendValues = (input) => {
        setCurrent(prevValue => prevValue + input)
        setExpression(prevValue => prevValue + input)
    }

    const replaceValues = (input) => {
        setExpression(prevValue => prevValue.slice(0,prevValue.length-1) + input)
        setCurrent(input)
    }

    const evaluate = (expression) => {
        // alternative to eval()
        API.request(expression)
            .then((response) => {
                return response.text()
                    .then(text => JSON.parse(text));
            })
            .then((data) => {
                console.log(data)
                const { result } = data
                setExpression(prevValue => prevValue + '=' + result)
                setCurrent(result)
                setEndCondition(true)
            })
            .catch((error) => {
                console.log(error)
            })
        return
    }

    const endConditionDecorator = (wrappedFunc) => {
        return () => {
            if(!endCondition){
                return wrappedFunc.apply(this,arguments)
            }
        }
    }

    // handlers 

    const dotHandler = (lastCharacter, input) => {
        if(isOperand(lastCharacter)){return}
        if(current.search(/\./g)!==-1 || !current){return}
        appendValues(input)
    }

    const valueHandler = (lastCharacter, input) => {
        if(current===0){return}
        if(current.search(/\./g)!==-1 || isValue(lastCharacter) || lastCharacter==='-'){
            appendValues(input)
        } else {
            chaseValues(input)
        }
    }

    const subtractHandler = (lastCharacter, input) => {
        if(lastCharacter==='.' || lastCharacter==='-'){return}
        chaseValues(input)
    }

    const operandHandler = (lastCharacter, input) => {
        if(lastCharacter==='.' || lastCharacter==='-' || !current){return}
        if(isOperand(lastCharacter)){
            replaceValues(input)
        } else {
            chaseValues(input)
        }
    }

    const resetValues = () => {
        setExpression('')
        setCurrent('')
    }

    const equalsHandler = () => {
        evaluate(expression)
    }

    return (
        <GeneralContext.Provider value={{current, expression, handleChange}}>
            {props.children}
        </GeneralContext.Provider>
    )

}
