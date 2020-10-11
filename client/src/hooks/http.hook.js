import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            // это условие нужно чтоб передавать корректные данные на сервер, т.е. переводится из объекта в json фотмат
            // чтоб сервер их корректно обработал
            // в headers  мы дополнительно сообщаем серверу что мы отправляем json данные

            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {method, body, headers})
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'something not good')
            }

            setLoading(false)

            return data
        } catch (e) {
            console.log('Catch', e.message)
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])
    const clearError = useCallback(() => setError(null), [])
    return {loading, request, error, clearError}
}