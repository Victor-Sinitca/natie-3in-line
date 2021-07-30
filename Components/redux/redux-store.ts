import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import createSagaMiddleware from 'redux-saga'
import threeInLineReducer from "./threeInLine-reduser";


declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducers = combineReducers({
    threeInLine:threeInLineReducer,
});

type RootReducerType=typeof rootReducers
export type AppStateType= ReturnType<RootReducerType>


export type InferActionsTypes<T> = T extends { [key: string]: (...args: any[]) => infer U } ? U : never

export type BaseActionType<A extends Action, R = Promise<void>> = ThunkAction<R, AppStateType, any, A> // экшены выбранного редюсора
export type AnyBaseActionType<A extends Action = Action, R = Promise<void>> = ThunkAction<R, AppStateType, any, A> // экшены со всех редюсоров


const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducers, composeEnhancers(
    applyMiddleware(sagaMiddleware,thunkMiddleware)
));


// @ts-ignore
window.store=store;


export default store;
