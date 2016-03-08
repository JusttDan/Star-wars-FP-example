import React from 'react'
import {compose, last, match} from 'ramda'

const getId = compose(last, match(/(\d+)/))

class Character extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        'movies' : [],
        'fetched': false
    }
  }
  getDetails(){
    if(!this.state.fetched){
        this.props.films.fork(
          (err) => console.log(err),
          (movies) => this.setState({movies, fetched:true}))
    }
  }
  render() {
      return (
        <li className="character">
            <h3>#{getId(this.props.url)} {this.props.name}</h3>
            <ul>
                <li>Mass: {this.props.mass}</li>
                <li>Height: {this.props.height}</li>
                <li>Gender: {this.props.gender}</li>
            </ul>

          { !this.state.fetched
            ? <button className="movieBar" onClick={this.getDetails.bind(this)}>View Movies</button>
            : <p>Appears in: {this.state.movies.map(movie => movie.title).join(', ')}</p>
          }
        </li>
      );
  }
}

export default Character
