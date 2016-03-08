import {invoker, curry, composeP, compose, lift} from 'ramda';
import Either from 'data.either';
import Maybe from 'data.maybe';
import Task from 'data.task'

export const getJson = invoker(0, 'json')

export const debug = curry((def, x) => {
  console.log(def || 'DEBUG: ', x);
  return x;
})

export const httpGet = curry((url) => {
  return new Task((reject, resolve) => {
      fetch(url).then(composeP(resolve, getJson)).catch(reject);
  })
})
