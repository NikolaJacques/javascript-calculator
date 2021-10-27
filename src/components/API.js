export const API = (() => {

    const url = 'http://api.mathjs.org/v4/'

    const request = async (expression) => {
        const encodedExpression = encodeURI(expression)  
        const response = await fetch(`${url}?expr=${encodedExpression}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                expr: encodedExpression,
                precision: 4
            }) 
        })
        return response
    }

    return {
        request
    }

})()