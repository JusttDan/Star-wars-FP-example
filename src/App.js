import React from 'react'
import {Model} from './starwars/sw_model'
import {concat, lens, lensProp, over, compose} from 'ramda'
import {debug} from './utils'
import Character from './components/character'

const log = console.log.bind(console)
const lensP = lensProp('results')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        'results' : [],
        'page' : 0
    }
    this.currentState = this.currentState.bind(this)
    this.updateState = this.updateState.bind(this)
  }
  componentDidMount(){
      Model.get().fork(log, this.updateState.bind(this))
  }
  updateState(state){
      if(this.interval){
          clearInterval(this.interval)
      }
      this.setState({...state, page: this.state.page + 1, isLoading: false, dots: ''})
  }
  currentState(key){
      return this.state[key]
  }

  dotProgress(){
      this.setState({isLoading: true, dots: '.'})
      this.interval = setInterval(() => this.setState({dots: this.state.dots + "."}), 500)
  }

  fetch(){
        this.dotProgress()
        const concatState = compose(concat, this.currentState)
        Model.
            get(this.state.next).
            fork(log,
               compose(
                  this.updateState,
                  debug('state'), over(lensP, concatState('results')))
            )
  }

  loadText(){
      return (this.state.isLoading ? 'Loading' + this.state.dots : 'Load More')
  }

  render() {
      let buttonClass = 'LoadMore ' + (this.state.isLoading ? 'loading' : '')
      return (
          <div className="sw_app">
              {this.state.results.length === 0
                  ? <h1>Loading...</h1>
                  : <div>
                      <h1>Star Wars Characters</h1>
                        <ul>
                          {this.state.results.map((cdata) =>
                              <Character key={cdata.name} {...cdata} />
                          )}
                        </ul>
                      {!!this.state.next &&
                          <button
                            className={buttonClass}
                            onClick={this.fetch.bind(this)}>{this.loadText()}
                          </button>
                      }
                  </div>
              }
          </div>
      );
  }

}

export default App
