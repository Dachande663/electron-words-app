'use strict';


const { h, render } = require('preact');
const { applyMiddleware, createStore } = require('redux');
const { default: thunkMiddleware } = require('redux-thunk');


const { reducers } = require('./reducers');
const { AppContainer } = require('./components');

const store = createStore(reducers, applyMiddleware(thunkMiddleware));


console.log('Initial State', store.getState());
store.subscribe(() => {
	console.log('State Change', store.getState())
});


render(h(AppContainer, { store }), document.body);
