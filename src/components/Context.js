import { createContext, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { API } from './API'

export const GeneralContext = createContext()

export default function Context(props) {

    const [expression, setExpression] = useState('')
    const [current, setCurrent] = useState('0')
    const [startCondition, setStartCondition] = useState(true)
    const [endCondition, setEndCondition] = useState(false)

    const handleChange = (e) => {
        const input = e.target.innerText
        const lastCharacter = current[current.length-1]===undefined?'':current[current.length-1]
        switch(input) {
            case '.':
                if(!endCondition){
                    decimalHandler(lastCharacter, input)
                }
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
                if(!endCondition){valueHandler(lastCharacter, input)}
                return
            case '-':
                if(!endCondition){subtractHandler(lastCharacter, input)}
                return
            case'/':
            case '*':
            case '+':
                if(endCondition){
                    setExpression(current)
                    setEndCondition(false)
                }
                operandHandler(lastCharacter, input)
                return
            case 'AC':
                resetValues()
                return
            case '=':
                if(!endCondition){equalsHandler()}
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


    const filterExpression = (expression) => {
        const regexOperands = /[/*\-+]{2,}/g
        const result = expression.split('')
        const inverted = Array.from(expression.matchAll(regexOperands))
        let matches = []
        for (let i=inverted.length-1;i>-1;i--){matches.push(inverted.pop())}
        for(const match of matches){
            result.splice(match.index,match[0].length,match[0][match[0].length-1]==='-'?match[0][match[0].length-2]+'-':match[0][match[0].length-1])
        }
        return result.join('')
    }

    const evaluate = (expression) => {
        // eslint-disable-next-line no-eval
        const result = eval(filterExpression(expression))
        setExpression(prevValue => prevValue + '=' + result)
        setCurrent(result)

        // alternative to eval() that doesn't pass FCC tests
        /* API.request(expression)
            .then((response) => {
                return response.text()
                    .then(text => JSON.parse(text));
            })
            .then((data) => {
                const { result } = data
                setExpression(prevValue => prevValue + '=' + result)
                setCurrent(result)
            })
            .catch((error) => {
                console.log(error)
            })
        return */
    }

    // handlers 

    const decimalHandler = (lastCharacter, input) => {
        if(isOperand(lastCharacter)){return}
        if(current.search(/\./g)!==-1 || !current){return}
        appendValues(input)
    }

    const valueHandler = (lastCharacter, input) => {
        if(startCondition){
            setCurrent(input)
            setExpression(input)
            setStartCondition(false)
            return
        }
        if(current==='0'){return}
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
        if(lastCharacter==='.' || (lastCharacter==='-'&& input==='-') || !current){return}
        if(isOperand(lastCharacter)){
            appendValues(input)
        } else {
            chaseValues(input)
        }
    }

    const resetValues = () => {
        setExpression('')
        setCurrent('0')
        setEndCondition(false)
        setStartCondition(true)
    }

    const equalsHandler = () => {
        evaluate(expression)
        setEndCondition(true)
    }

    return (
        <GeneralContext.Provider value={{current, expression, handleChange}}>
            {props.children}
        </GeneralContext.Provider>
    )

}
