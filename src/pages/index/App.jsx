import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

@observer
class App extends React.Component {
  onReset = () => {
    this.props.appState.resetTimer()
  }

  render () {
    return (
      <div>
        <h1>React + Mobx + React-Router multi-single page application</h1>
        <button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>
        <DevTools />
      </div>
    )
  }
}

export default App
