import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import AppState from './AppState'
import App from './App'

const appState = new AppState()

function render (Component) {
  ReactDOM.render(
    <AppContainer>
      <Component appState={appState} />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) module.hot.accept('./App', _ => render(App))
