import {
  compose, map, prop, curry,
  pick, values, wrap, get, lens, lensProp, over
} from 'ramda'

//Either and Maybe Monads
import Maybe from 'data.maybe'
import daggy from 'daggy'
import Task from 'data.task'
import {debug, getJson, httpGet} from '../utils'

//Parallel :: [Task] -> Task
const parallel = require('parallel-future')(Task)

//PROPS
const PROPS = ['name', 'url', 'height', 'mass', 'gender', 'films']

// Character
const Character = daggy.tagged(...PROPS)

// lensP :: Function -> Function
const lensP = lensProp('results')

// filmUrls :: Function -> Function
const filmUrls = lensProp('films')

//createUrl :: String -> Maybe String
const createUrl = curry((url=`http://swapi.co/api/people/`) => Maybe.of(url))

// makeCharacter :: JSON -> Character
const makeCharacter = compose(wrap(Character, (f, args) => f(...args)), values, pick(PROPS))

// fetchUrls :: String -> [Task] -> Task
const fetchUrls = compose(parallel, map(httpGet))

// getCharacter :: JSON -> JSON
const getCharacter = compose(makeCharacter, over(filmUrls, fetchUrls))

// getData :: Task -> JSON
const getData = compose(map(over(lensP, map(getCharacter))), httpGet)

// Model :: Maybe String -> Maybe Task -> Task
export const Model = {get: compose(prop('value'), map(getData), createUrl)  }
