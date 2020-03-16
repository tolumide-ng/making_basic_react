let React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag == 'function') {
            try {
                return tag(props)
                
            } catch ({ promise, key }) {
                promise.then(data => {
                    promiseCache.set(key, data)
                    rerender()
                })
                return { tag: 'h1', props: {children: ['I am Loading!']}}
            }
        }
        const element = { tag, props: {...props, children} }
        return element
    }
}


const states = []

let stateCursor = 0;



const useState = (initialState) => {
    const FROZENCURSOR = stateCursor
    
    states[FROZENCURSOR] = states[FROZENCURSOR] || initialState
    console.log(states)

    const setState = (newState) => {
        states[FROZENCURSOR] = newState;
        rerender()
    }
    stateCursor++
    return [states[FROZENCURSOR] , setState]
}

const handleChange = (e) => {}

const promiseCache = new Map()

const createResource = (theResponse, key) => {
    if (promiseCache.has(key)) {
        return promiseCache.get(key)
    }

    throw {promise: theResponse, key}
}



const App = () => {

    const [name, setName] = useState('tolumide')
    const [count, setCount] = useState(1)

    const dogPhoto = createResource(fetch('https://dog.ceo/api/breeds/image/random').then(r => r.json()).then(payload => payload.message),  'dogPhoto')

    return (
        <main className='react-2020'>
        <h1>Hello {name}!</h1>
            <section>
                <div className='userInfo'>
                    <input className='inputTag' name='username' onchange={e => setName(e.target.value)} placeholder='username' type='text' value={name} />
                </div>
                <div className="counter">
                    <h2>The count is: {count}</h2>
                    <button onclick={() => setCount(count + 1)}>+</button>
                    <button onclick={() => setCount(count - 1)}>-</button>
                </div>
                <h2 className='h2tag'>Introduction</h2>
                <img src={dogPhoto} alt='good dog' />
            <p>
                I am a Dog, I used to be from Nigeria but not anymore :evil-smile hahaha
            </p>
        </section>
    </main>
    )
}

const render = (reactElement, container) => {
    if (['string', 'number'].includes(typeof reactElement)) {
        const textElem = document.createTextNode(reactElement.toString())
        return container.appendChild(textElem)
    }

    const actualDomElement = document.createElement(reactElement?.tag);
    if (reactElement?.props) {
        Object.keys(reactElement.props).filter(p => p !== 'children').forEach(p => actualDomElement[p] = reactElement.props[p])
    }

    if (reactElement?.props?.children) {
        reactElement.props.children.forEach(child => render(child, actualDomElement))
    }

    container.appendChild(actualDomElement)
}

const rerender = () => {
    stateCursor = 0 
    document.querySelector('#app').firstChild.remove()
    render(<App />, document.querySelector('#app'))
}

render(<App />, document.querySelector('#app'))