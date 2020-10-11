import { useState, useCallback, useEffect } from 'react'
const storgeName = 'userData'


export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false) //данное свойство  нужно чтобы после перезагрузки не гдавной страницы она не редиректилась на Главную
    const [userId, setUserId] = useState(null)

    const login = useCallback((jwtToken, id)=> {
        setToken(jwtToken)
        setUserId(id)
        // localStorage это встроенное хранилище в браузер(для страницы не более 5 мб)
        // в которое мы сохранили объект storageName b передали userId: id, token: jwtToken 
        // чтобы useCallback не ругался на зависимости для userId и token
        localStorage.setItem(storgeName, JSON.stringify({
            userId: id, token: jwtToken
        }))
    }, [])

    const logout = useCallback(()=> {
        setToken(null)
        setUserId(null)
        // после вылогинивания очистили кэш
        localStorage.removeItem(storgeName)
    }, [])


    // данный метод нужен для того чтоб пользователь не логинился после каждого закрытия окна браузера
    // т.е. обращаемся к localStorage через getItem(storgeName) и приводим его из JSON в объект
    // если объект существует и в нем есть токен data && data.token запускаем функцию login
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storgeName))
        if (data && data.token) {
            login(data.token, data.userId)
        }
        setReady(true)
    }, [login])

    return { login, logout, token, userId, ready }
}