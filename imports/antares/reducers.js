import { List, fromJS } from 'immutable'
import { createReducer } from 'redux-act'
import { combineReducers } from 'redux-immutable'
import { inAgencyRun } from 'meteor/deanius:antares'

const messageReducer = createReducer({
    'Message.send': (msgs, message) => {
        inAgencyRun('server', () => {
            if (message.message.includes('server error')) {
                throw new Error('he shits the bed at the battle of Monmouth')
            }
        })
        return msgs.push(fromJS(message))
    },
    'Message.markError': (msgs, { message, sender }) => {
        return msgs.map(msg => {
            return (msg.get('message') === message && msg.get('sender') === sender) ?
                msg.set('error', true) : msg
        })
    }
}, new List([]))

const sendersReducer = createReducer({
}, new List(['Self', 'Other 1', 'Other 2']))

export const ChatReducer = combineReducers({
    senders: sendersReducer,
    messages: messageReducer,
})

const activityReducer = createReducer({
    'Activity.notifyOfTyping': (state, { active, sender }) => {
        if (active) {
            return state.setIn(['isTyping', sender], active)
        }
        return state.deleteIn(['isTyping', sender])
    }
}, fromJS({ isTyping: {} }))

export const ViewReducer = combineReducers({
    viewingAs: createReducer({
        'View.selectViewer': (viewer, newViewer) => newViewer
    }, 'Self'),
    activity: activityReducer
})
