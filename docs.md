// some examples of xstate v5 machines, build what I ask you by first studying this. 
import { assign, setup } from 'xstate';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

export type TodosFilter = 'all' | 'active' | 'completed';

export const todosMachine = setup({
  types: {} as {
    context: {
      todo: string;
      todos: TodoItem[];
      filter: TodosFilter;
    };
    events:
      | { type: 'newTodo.change'; value: string }
      | { type: 'newTodo.commit'; value: string }
      | { type: 'todo.commit'; todo: TodoItem }
      | { type: 'todo.delete'; id: string }
      | { type: 'filter.change'; filter: TodosFilter }
      | { type: 'todo.mark'; id: string; mark: 'active' | 'completed' }
      | { type: 'todo.markAll'; mark: 'active' | 'completed' }
      | { type: 'todos.clearCompleted' };
  }
}).createMachine({
  id: 'todos',
  context: {
    todo: '',
    todos: [
      {
        id: '1',
        title: 'Learn state machines',
        completed: false
      }
    ],
    filter: 'all'
  },
  on: {
    'newTodo.change': {
      actions: assign({
        todo: ({ event }) => event.value
      })
    },
    'newTodo.commit': {
      guard: ({ event }) => event.value.trim().length > 0,
      actions: assign({
        todo: '',
        todos: ({ context, event }) => {
          const newTodo: TodoItem = {
            id: Math.random().toString(36).substring(7),
            title: event.value,
            completed: false
          };

          return [...context.todos, newTodo];
        }
      })
    },
    'todo.commit': {
      actions: assign({
        todos: ({ context, event }) => {
          const { todo: todoToUpdate } = event;

          if (!todoToUpdate.title.trim().length) {
            return context.todos.filter((todo) => todo.id !== todoToUpdate.id);
          }

          return context.todos.map((todo) => {
            if (todo.id === todoToUpdate.id) {
              return todoToUpdate;
            }

            return todo;
          });
        }
      })
    },
    'todo.delete': {
      actions: assign({
        todos: ({ context, event }) => {
          const { id } = event;

          return context.todos.filter((todo) => todo.id !== id);
        }
      })
    },
    'filter.change': {
      actions: assign({
        filter: ({ event }) => event.filter
      })
    },
    'todo.mark': {
      actions: assign({
        todos: ({ context, event }) => {
          const { mark } = event;

          return context.todos.map((todo) => {
            if (todo.id === event.id) {
              return {
                ...todo,
                completed: mark === 'completed'
              };
            }

            return todo;
          });
        }
      })
    },
    'todo.markAll': {
      actions: assign({
        todos: ({ context, event }) => {
          const { mark } = event;

          return context.todos.map((todo) => {
            return {
              ...todo,
              completed: mark === 'completed'
            };
          });
        }
      })
    },
    'todos.clearCompleted': {
      actions: assign({
        todos: ({ context }) => {
          return context.todos.filter((todo) => !todo.completed);
        }
      })
    }
  }
});


*****

import { fromCallback, setup, assign } from 'xstate';

export type TimerMachineContext = {
  elapsed: number;
};

export const timerMachine = setup({
  types: {
    context: {} as TimerMachineContext,
    events: {} as
      | { type: 'START' }
      | { type: 'STOP' }
      | { type: 'RESET' }
      | { type: 'TICK' }
  },
  actions: {
    'increment elapsed': assign({
      elapsed: ({ context }) => context.elapsed + 1
    }),
    'reset elapsed': assign({
      elapsed: () => 0
    })
  },
  actors: {
    ticks: fromCallback(({ sendBack }) => {
      const intervalId = setInterval(() => {
        sendBack({ type: 'TICK' });
      }, 1000);

      return () => clearInterval(intervalId);
    })
  }
}).createMachine({
  id: 'TimerMachine',
  context: { elapsed: 0 },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        START: {
          target: 'Running'
        },
        RESET: {
          actions: 'reset elapsed'
        }
      }
    },
    Running: {
      invoke: {
        src: 'ticks'
      },
      on: {
        TICK: {
          actions: 'increment elapsed'
        },
        STOP: {
          target: 'Idle'
        },
        RESET: {
          actions: 'reset elapsed',
          target: 'Idle'
        }
      }
    }
  }
});

****
import { assign, setup } from 'xstate';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

export type TodosFilter = 'all' | 'active' | 'completed';

export const todosMachine = setup({
  types: {} as {
    context: {
      todo: string;
      todos: TodoItem[];
      filter: TodosFilter;
    };
    events:
      | { type: 'newTodo.change'; value: string }
      | { type: 'newTodo.commit'; value: string }
      | { type: 'todo.commit'; todo: TodoItem }
      | { type: 'todo.delete'; id: string }
      | { type: 'filter.change'; filter: TodosFilter }
      | { type: 'todo.mark'; id: string; mark: 'active' | 'completed' }
      | { type: 'todo.markAll'; mark: 'active' | 'completed' }
      | { type: 'todos.clearCompleted' };
  }
}).createMachine({
  id: 'todos',
  context: {
    todo: '',
    todos: [
      {
        id: '1',
        title: 'Learn state machines',
        completed: false
      }
    ],
    filter: 'all'
  },
  on: {
    'newTodo.change': {
      actions: assign({
        todo: ({ event }) => event.value
      })
    },
    'newTodo.commit': {
      guard: ({ event }) => event.value.trim().length > 0,
      actions: assign({
        todo: '',
        todos: ({ context, event }) => {
          const newTodo: TodoItem = {
            id: Math.random().toString(36).substring(7),
            title: event.value,
            completed: false
          };

          return [...context.todos, newTodo];
        }
      })
    },
    'todo.commit': {
      actions: assign({
        todos: ({ context, event }) => {
          const { todo: todoToUpdate } = event;

          if (!todoToUpdate.title.trim().length) {
            return context.todos.filter((todo) => todo.id !== todoToUpdate.id);
          }

          return context.todos.map((todo) => {
            if (todo.id === todoToUpdate.id) {
              return todoToUpdate;
            }

            return todo;
          });
        }
      })
    },
    'todo.delete': {
      actions: assign({
        todos: ({ context, event }) => {
          const { id } = event;

          return context.todos.filter((todo) => todo.id !== id);
        }
      })
    },
    'filter.change': {
      actions: assign({
        filter: ({ event }) => event.filter
      })
    },
    'todo.mark': {
      actions: assign({
        todos: ({ context, event }) => {
          const { mark } = event;

          return context.todos.map((todo) => {
            if (todo.id === event.id) {
              return {
                ...todo,
                completed: mark === 'completed'
              };
            }

            return todo;
          });
        }
      })
    },
    'todo.markAll': {
      actions: assign({
        todos: ({ context, event }) => {
          const { mark } = event;

          return context.todos.map((todo) => {
            return {
              ...todo,
              completed: mark === 'completed'
            };
          });
        }
      })
    },
    'todos.clearCompleted': {
      actions: assign({
        todos: ({ context }) => {
          return context.todos.filter((todo) => !todo.completed);
        }
      })
    }
  }
});

*****some docs
State machines
A state machine is a model that describes the behavior of something, for example an actor. Finite state machines describe how the state of an actor transitions to another state when an event occurs.

Read our introduction to state machines and statecharts if you haven’t already!

Benefits of state machines
State machines help build reliable and robust software. Read more about the benefits of state machines.

Creating a state machine
In XState, a state machine (referred to as a “machine”) is created using the createMachine(config) function:

import { createMachine } from 'xstate';

const feedbackMachine = createMachine({
  id: 'feedback',
  initial: 'question',
  states: {
    question: {
      on: {
        'feedback.good': {
          target: 'thanks',
        },
      },
    },
    thanks: {
      // ...
    },
    // ...
  },
});

In this example, the machine has two states: question and thanks. The question state has a transition to the thanks state when the feedback.good event is sent to the machine:

const feedbackActor = createActor(feedbackMachine);

feedbackActor.subscribe((state) => {
  console.log(state.value);
});

feedbackActor.start();
// logs 'question'

feedbackActor.send({ type: 'feedback.good' });
// logs 'thanks'

Creating actors from machines
A machine contains the logic of an actor. An actor is a running instance of the machine; in other words, it is the entity whose logic is described by the machine. Multiple actors can be created from the same machine, and each of those actors will exhibit the same behavior (reaction to received events), but they will be independent of each other and have their own states.

To create an actor, use the createActor(machine) function:

import { createActor } from 'xstate';

const feedbackActor = createActor(feedbackMachine);

feedbackActor.subscribe((state) => {
  console.log(state.value);
});

feedbackActor.start();
// logs 'question'

You can also create an actor from other types of logic, such as functions, promises, and observables.

Providing implementations
Machine implementations are the language-specific code that is executed but is not directly related to the state machine’s logic (states and transitions). This includes:

Actions, which are fire-and-forget side-effects.
Actors, which are entities that can communicate with the machine actor.
Guards, which are conditions that determine whether a transition should be taken.
Delays, which specify the time before a delayed transition is taken or a delayed event is sent.
The default implementations can be provided in a setup({...}) function when creating a machine, and then you can reference those implementations using JSON-serializable strings and/or objects, such as { type: 'doSomething' }.

import { setup } from 'xstate';

const feedbackMachine = setup({
  // Default implementations
  actions: {
    doSomething: () => {
      console.log('Doing something!');
    },
  },
  actors: {
    /* ... */
  },
  guards: {
    /* ... */
  },
  delays: {
    /* ... */
  },
}).createMachine({
  entry: { type: 'doSomething' },
  // ... rest of machine config
});

const feedbackActor = createActor(feedbackMachine)

feedbackActor.start();
// logs 'Doing something!'

You can override default implementations by providing implementations via machine.provide(...). This function will create a new machine with the same config, but with the provided implementations:

const customFeedbackMachine = feedbackMachine.provide({
  actions: {
    doSomething: () => {
      console.log('Doing something else!');
    },
  },
});

const feedbackActor = createActor(customFeedbackMachine)

feedbackActor.start();
// logs 'Doing something else!'

Determining the next state
When you create a state machine actor, the next state is determined by the machine's current state and the event that is sent to the actor. If you want to determine the next state outside of the actor, you can use the getNextSnapshot(…) function:

import { getNextSnapshot } from 'xstate';
import { feedbackMachine } from './feedbackMachine';

const nextSnapshot = getNextSnapshot(
  feedbackMachine,
  feedbackMachine.resolveState({ value: 'question' }),
  { type: 'feedback.good' }
);

console.log(nextSnapshot.value);
// logs 'thanks'

You can also determine the initial state of a machine using the getInitialSnapshot(…) function:

import { getInitialSnapshot } from 'xstate';
import { feedbackMachine } from './feedbackMachine';

const initialSnapshot = getInitialSnapshot(
  feedbackMachine,
  // optional input
  { defaultRating: 3 }
);

console.log(initialSnapshot.value);
// logs 'question'

Specifying types
You can specify TypeScript types inside the machine config using the .types property:

import { createMachine } from 'xstate';

const feedbackMachine = createMachine({
  types: {} as {
    context: { feedback: string };
    events: { type: 'feedback.good' } | { type: 'feedback.bad' };
    actions: { type: 'logTelemetry' };
  },
});

These types will be inferred throughout the machine config and in the created machine and actor so that methods such as machine.transition(...) and actor.send(...) will be type-safe.

If you are using the setup(...) function, you should provide the types in the .types property inside the setup function:

import { setup } from 'xstate';

const feedbackMachine = setup({
  types: {} as {
    context: { feedback: string };
    events: { type: 'feedback.good' } | { type: 'feedback.bad' };
  },
  actions: {
    logTelemetry: () => {
      // TODO: implement
    }
  }
}).createMachine({
  // ...
});

Typegen
Typegen does not yet support XState v5. However, with the setup(...) function and/or the .types property explained above, you can provide strong typing for most (if not all) of your machine.

Read more about setting up state machines.

API
Coming soon…

Machines and TypeScript
XState v5 requires TypeScript version 5.0 or greater.

For best results, use the latest TypeScript version. Read more about XState and TypeScript

The best way to provide strong typing for your machine is to use the setup(...) function and/or the .types property.

import { setup, fromPromise } from 'xstate';

const someAction = () => {/* ... */};

const someGuard = ({ context }) => context.count <= 10;

const someActor = fromPromise(async () => {
  // ...
  return 42;
});

const feedbackMachine = setup({
  types: {
    context: {} as { count: number };
    events: {} as { type: 'increment' } | { type: 'decrement' };
  },
  actions: {
    someAction
  },
  guards: {
    someGuard
  },
  actors: {
    someActor
  }
}).createMachine({
  initial: 'counting',
  states: {
    counting: {
      entry: { type: 'someAction' }, // strongly-typed
      invoke: {
        src: 'someActor', // strongly-typed
        onDone: {
          actions: ({ event }) => {
            event.output; // strongly-typed as number
          }
        }
      },
      on: {
        increment: {
          guard: { type: 'someGuard' }, // strongly-typed
          actions: assign({
            count: ({ context }) => context.count + 1
          })
        }
      },
    }
  }
});

Machine cheatsheet
Use our XState machine cheatsheet below to get started quickly.

Cheatsheet: create a machine
import { createMachine } from 'xstate';

const machine = createMachine({
  initial: 'start',
  states: {
    start: {},
    // ...
  },
});

Cheatsheet: setup a machine with implementations
import { setup } from 'xstate';

const machine = setup({
  actions: {
    someAction: () => {/* ... */}
  },
  guards: {
    someGuard: ({ context }) => context.count <= 10
  },
  actors: {
    someActor: fromPromise(async () => {/* ... */})
  },
  delays: {
    someDelay: () => 1000
  }
}).createMachine({
  // ... Rest of machine config
})

Cheatsheet: provide implementations
import { createMachine } from 'xstate';
import { someMachine } from './someMachine'

const machineWithImpls = someMachine.provide({
  actions: {
    /* ... */
  },
  actors: {
    /* ... */
  },
  guards: {
    /* ... */
  },
  delays: {
    /* ... */
  },
});

***** Actors:
Actors
When you run a state machine, it becomes an actor: a running process that can receive events, send events and change its behavior based on the events it receives, which can cause effects outside of the actor.

In state machines, actors can be invoked or spawned. These are essentially the same, with the only difference being how the actor’s lifecycle is controlled.

An invoked actor is started when its parent machine enters the state it is invoked in, and stopped when that state is exited.
A spawned actor is started in a transition and stopped either with a stop(...) action or when its parent machine is stopped.
You can visualize your state machines and easily invoke actors in our drag-and-drop Stately editor. Read more about actors in Stately’s editor.

Watch our “XState: exploring actors” deep dive video on YouTube.


Actor model
In the actor model, actors are objects that can communicate with each other. They are independent “live” entities that communicate via asynchronous message passing. In XState, these messages are referred to as events.

An actor has its own internal, encapsulated state that can only be updated by the actor itself. An actor may choose to update its internal state in response to a message it receives, but it cannot be updated by any other entity.
Actors communicate with other actors by sending and receiving events asynchronously.
Actors process one message at a time. They have an internal “mailbox” that acts like an event queue, processing events sequentially.
Internal actor state is not shared between actors. The only way for an actor to share any part of its internal state is by:
Sending events to other actors
Or emitting snapshots, which can be considered implicit events sent to subscribers.
Actors can create (spawn/invoke) new actors.
Read more about the Actor model

Actor logic
Actor logic is the actor’s logical “model” (brain, blueprint, DNA, etc.) It describes how the actor should change behavior when receiving an event. You can create actor logic using actor logic creators.

In XState, actor logic is defined by an object implementing the ActorLogic interface, containing methods like .transition(...), .getInitialSnapshot(), .getPersistedSnapshot(), and more. This object tells an interpreter how to update an actor’s internal state when it receives an event and which effects to execute (if any).

Creating actors
You can create an actor, which is a “live” instance of some actor logic, via createActor(actorLogic, options?). The createActor(...) function takes the following arguments:

actorLogic: the actor logic to create an actor from
options (optional): actor options
When you create an actor from actor logic via createActor(actorLogic), you implicitly create an actor system where the created actor is the root actor. Any actors spawned from this root actor and its descendants are part of that actor system. The actor must be started by calling actor.start(), which will also start the actor system:

import { createActor } from 'xstate';
import { someActorLogic } from './someActorLogic.ts';

const actor = createActor(someActorLogic);

actor.subscribe((snapshot) => {
  console.log(snapshot);
});

actor.start();

// Now the actor can receive events
actor.send({ type: 'someEvent' });

You can stop root actors by calling actor.stop(), which will also stop the actor system and all actors in that system:

// Stops the root actor, actor system, and actors in the system
actor.stop();

Invoking and spawning actors
An invoked actor represents a state-based actor, so it is stopped when the invoking state is exited. Invoked actors are used for a finite/known number of actors.

A spawned actor represents multiple entities that can be started at any time and stopped at any time. Spawned actors are action-based and used for a dynamic or unknown number of actors.

An example of the difference between invoking and spawning actors could occur in a todo app. When loading todos, a loadTodos actor would be an invoked actor; it represents a single state-based task. In comparison, each of the todos can themselves be spawned actors, and there can be a dynamic number of these actors.

Read more about invoking actors
Read more about spawning actors
Actor snapshots
When an actor receives an event, its internal state may change. An actor may emit a snapshot when a state transition occurs. You can read an actor’s snapshot synchronously via actor.getSnapshot(), or you can subscribe to snapshots via actor.subscribe(observer).

import { fromPromise, createActor } from 'xstate';

async function fetchCount() {
  return Promise.resolve(42);
}

const countLogic = fromPromise(async () => {
  const count = await fetchCount();

  return count;
});

const countActor = createActor(countLogic);

countActor.start();

countActor.getSnapshot(); // logs undefined

// After the promise resolves...
countActor.getSnapshot();
// => {
//   output: 42,
//   status: 'done',
//   ...
// }

Subscriptions
You can subscribe to an actor’s snapshot values via actor.subscribe(observer). The observer will receive the actor’s snapshot value when it is emitted. The observer can be:

A plain function that receives the latest snapshot, or
An observer object whose .next(snapshot) method receives the latest snapshot
// Observer as a plain function
const subscription = actor.subscribe((snapshot) => {
  console.log(snapshot);
});

// Observer as an object
const subscription = actor.subscribe({
  next(snapshot) {
    console.log(snapshot);
  },
  error(err) {
    // ...
  },
  complete() {
    // ...
  },
});

The return value of actor.subscribe(observer) is a subscription object that has an .unsubscribe() method. You can call subscription.unsubscribe() to unsubscribe the observer:

const subscription = actor.subscribe((snapshot) => {
  /* ... */
});

// Unsubscribe the observer
subscription.unsubscribe();

When the actor is stopped, all of its observers will automatically be unsubscribed.

You can initialize actor logic at a specific persisted snapshot (state) by passing the state in the second options argument of createActor(logic, options). If the state is compatible with the actor logic, this will create an actor that will be started at that persisted state:

const persistedState = JSON.parse(localStorage.getItem('some-persisted-state'));

const actor = createActor(someLogic, {
  snapshot: persistedState,
});

actor.subscribe(() => {
  localStorage.setItem(
    'some-persisted-state',
    JSON.stringify(actor.getPersistedSnapshot()),
  );
});

// Actor will start at persisted state
actor.start();

See persistence for more details.

You can wait for an actor’s snapshot to satisfy a predicate using the waitFor(actor, predicate, options?) helper function. The waitFor(...) function returns a promise that is:

Resolved when the emitted snapshot satisfies the predicate function
Resolved immediately if the current snapshot already satisfies the predicate function
Rejected if an error is thrown or the options.timeout value is elapsed.
import { waitFor } from 'xstate';
import { countActor } from './countActor.ts';

const snapshot = await waitFor(
  countActor,
  (snapshot) => {
    return snapshot.context.count >= 100;
  },
  {
    timeout: 10_000, // 10 seconds (10,000 milliseconds)
  },
);

console.log(snapshot.output);
// => 100

Error handling
You can subscribe to errors thrown by an actor using the error callback in the observer object passed to actor.subscribe(). This allows you to handle errors emitted by the actor logic.

import { createActor } from 'xstate';
import { someMachine } from './someMachine';

const actor = createActor(someMachine);

actor.subscribe({
  next: (snapshot) => {
    // ...
  },
  error: (err) => {
    // Handle the error here
    console.error(err);
  }
});

actor.start();

Actor logic creators
The types of actor logic you can create from XState are:

State machine logic (createMachine(...))
Promise logic (fromPromise(...))
Transition function logic (fromTransition(...))
Observable logic (fromObservable(...))
Event observable logic (fromEventObservable(...))
Callback logic (fromCallback(...))
Actor logic capabilities
Receive events	Send events	Spawn actors	Input	Output
State machine actors	✅	✅	✅	✅	✅
Promise actors	❌	✅	❌	✅	✅
Transition actors	✅	✅	❌	✅	❌
Observable actors	❌	✅	❌	✅	❌
Callback actors	✅	✅	❌	✅	❌
State machine logic (createMachine(...))
You can describe actor logic as a state machine. Actors created from state machine actor logic can:

Receive events
Send events to other actors
Invoke/spawn child actors
Emit snapshots of its state
Output a value when the machine reaches its top-level final state
const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: {},
    active: {},
  },
});

const toggleActor = createActor(toggleMachine);

toggleActor.subscribe((snapshot) => {
  // snapshot is the machine's state
  console.log('state', snapshot.value);
  console.log('context', snapshot.context);
});
toggleActor.start();
// Logs 'inactive'
toggleActor.send({ type: 'toggle' });
// Logs 'active'

Learn more about state machine actors.

Promise logic (fromPromise(...))
Promise actor logic is described by an async process that resolves or rejects after some time. Actors created from promise logic (“promise actors”) can:

Emit the resolved value of the promise
Output the resolved value of the promise
Sending events to promise actors will have no effect.

const promiseLogic = fromPromise(() => {
  return fetch('https://example.com/...').then((data) => data.json());
});

const promiseActor = createActor(promiseLogic);
promiseActor.subscribe((snapshot) => {
  console.log(snapshot);
});
promiseActor.start();
// => {
//   output: undefined,
//   status: 'active'
//   ...
// }

// After promise resolves
// => {
//   output: { ... },
//   status: 'done',
//   ...
// }

Learn more about promise actors.

Transition function logic (fromTransition(...))
Transition actor logic is described by a transition function, similar to a reducer. Transition functions take the current state and received event object as arguments, and return the next state. Actors created from transition logic (“transition actors”) can:

Receive events
Emit snapshots of its state
const transitionLogic = fromTransition(
  (state, event) => {
    if (event.type === 'increment') {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    return state;
  },
  { count: 0 },
);

const transitionActor = createActor(transitionLogic);
transitionActor.subscribe((snapshot) => {
  console.log(snapshot);
});
transitionActor.start();
// => {
//   status: 'active',
//   context: { count: 0 },
//   ...
// }

transitionActor.send({ type: 'increment' });
// => {
//   status: 'active',
//   context: { count: 1 },
//   ...
// }

Learn more about transition actors.

Observable logic (fromObservable(...))
Observable actor logic is described by an observable stream of values. Actors created from observable logic (“observable actors”) can:

Emit snapshots of the observable’s emitted value
Sending events to observable actors will have no effect.

import { interval } from 'rxjs';

const secondLogic = fromObservable(() => interval(1000));

const secondActor = createActor(secondLogic);

secondActor.subscribe((snapshot) => {
  console.log(snapshot.context);
});

secondActor.start();
// At every second:
// Logs 0
// Logs 1
// Logs 2
// ...

Learn more about observable actors.

Event observable logic (fromEventObservable(...))
Event observable actor logic is described by an observable stream of event objects. Actors created from event observable logic (“event observable actors”) can:

Implicitly send events to its parent actor
Emit snapshots of its emitted event objects
Sending events to event observable actors will have no effect.

import { setup, fromEventObservable } from 'xstate';
import { fromEvent } from 'rxjs';

const mouseClickLogic = fromEventObservable(() =>
  fromEvent(document.body, 'click') as Subscribable<EventObject>
);

const canvasMachine = setup({
  actors: {
    mouseClickLogic
  }
}).createMachine({
  invoke: {
    // Will send mouse click events to the canvas actor
    src: 'mouseClickLogic',
  },
});

const canvasActor = createActor(canvasMachine);
canvasActor.start();

Learn more about observable actors.

Callback logic (fromCallback(...))
Callback actor logic is described by a callback function that receives a single object argument that includes a sendBack(event) function and a receive(event => ...) function. Actors created from callback logic (“callback actors”) can:

Receive events via the receive function
Send events to the parent actor via the sendBack function
const callbackLogic = fromCallback(({ sendBack, receive }) => {
  let lockStatus = 'unlocked';

  const handler = (event) => {
    if (lockStatus === 'locked') {
      return;
    }
    sendBack(event);
  };

  receive((event) => {
    if (event.type === 'lock') {
      lockStatus = 'locked';
    } else if (event.type === 'unlock') {
      lockStatus = 'unlocked';
    }
  });

  document.body.addEventListener('click', handler);

  return () => {
    document.body.removeEventListener('click', handler);
  };
});

Callback actors are a bit different from other actors in that they do not do the following:

Do not work with onDone
Do not produce a snapshot using .getSnapshot()
Do not emit values when used with .subscribe()
Can not be stopped with .stop()
You may choose to use sendBack to report caught errors to the parent actor. This is especially helpful for handling promise rejections within a callback function, which will not be caught by onError.

Callback functions cannot be async functions. But it is possible to execute a Promise within a callback function.

import { setup, fromCallback } from 'xstate';

const someCallback = fromCallback(({ sendBack }) => {
  somePromise()
    .then((data) => sendBack({ type: 'done', data }))
    .catch((error) => sendBack({ type: 'error', data: error }));

  return () => {
    /* cleanup function */
  };
})

const machine = setup({
  actors: {
    someCallback
  }
}).createMachine({
  initial: 'running',
  states: {
    running: {
      invoke: {
        src: 'someCallback',
      },
      on: {
        error: {
          actions: ({ event }) => console.error(event.data),
        },
      },
    },
  },
});

Learn more about callback actors.

Actors as promises
You can create a promise from any actor by using the toPromise(actor) function. The promise will resolve with the actor snapshot's .output when the actor is done (snapshot.status === 'done') or reject with the actor snapshot's .error when the actor is errored (snapshot.status === 'error').

import { createMachine, createActor, toPromise } from 'xstate';

const machine = createMachine({
  // ...
  states: {
    // ...
    done: { type: 'final' }
  },
  output: {
    count: 42
  }
});

const actor = createActor(machine);
actor.start();

// Creates a promise that resolves with the actor's output
// or rejects with the actor's error
const output = await toPromise(actor);

console.log(output);
// => { count: 42 }

If the actor is already done, the promise will resolve with the actor's snapshot.output immediately. If the actor is already errored, the promise will reject with the actor's snapshot.error immediately.

Higher-level actor logic
Higher-level actor logic enhances existing actor logic with additional functionality. For example, you can create actor logic that logs or persists actor state:

import { fromTransition, type AnyActorLogic } from 'xstate';

const toggleLogic = fromTransition((state, event) => {
  if (event.type === 'toggle') {
    return state === 'paused' ? 'playing' : 'paused';
  }

  return state;
}, 'paused');

function withLogging<T extends AnyActorLogic>(actorLogic: T) {
  const enhancedLogic = {
    ...actorLogic,
    transition: (state, event, actorCtx) => {
      console.log('State:', state);
      return actorLogic.transition(state, event, actorCtx);
    },
  } satisfies T;

  return enhancedLogic;
}

const loggingToggleLogic = withLogging(toggleLogic);

Custom actor logic
Custom actor logic can be defined with an object that implements the ActorLogic interface.

For example, here is a custom actor logic object with a transition function that operates as a simple reducer:

import { createActor, EventObject, ActorLogic, Snapshot } from "xstate";

const countLogic: ActorLogic<
  Snapshot<undefined> & { context: number },
  EventObject
> = {
  transition: (state, event) => {
    if (event.type === 'INC') {
      return {
        ...state,
        context: state.context + 1
      };
    } else if (event.type === 'DEC') {
      return {
        ...state,
        context: state.context - 1
      };
    }
    return state;
  },
  getInitialSnapshot: () => ({
    status: 'active',
    output: undefined,
    error: undefined,
    context: 0
  }),
  getPersistedSnapshot: (s) => s
};

const actor = createActor(countLogic)
actor.subscribe(state => {
  console.log(state.context)
})
actor.start() // => 0
actor.send({ type: 'INC' }) // => 1
actor.send({ type: 'INC' }) // => 2

For further examples, see implementations of ActorLogic in the source code, like the fromTransition actor logic creator, or the examples in the tests.

Empty actors
Actor that does nothing and only has a single emitted snapshot: undefined

In XState, an empty actor is an actor that does nothing and only has a single emitted snapshot: undefined.

This is useful for testing, such as stubbing out an actor that is not yet implemented. It can also be useful in framework integrations, such as @xstate/react, where an actor may not be available yet:

import { createEmptyActor, AnyActorRef } from 'xstate';
import { useSelector } from '@xstate/react';
const emptyActor = createEmptyActor();

function Component(props: { actor?: AnyActorRef }) {
  const data = useSelector(
    props.actor ?? emptyActor,
    (snapshot) => snapshot.context.data,
  );

  // data is `undefined` if `props.actor` is undefined
  // Otherwise, it is the data from the actor

  // ...
}

Actors and TypeScript
XState v5 requires TypeScript version 5.0 or greater.

For best results, use the latest TypeScript version. Read more about XState and TypeScript

You can strongly type the actors of your machine in the types.actors property of the machine config.

const fetcher = fromPromise(
  async ({ input }: { input: { userId: string } }) => {
    const user = await fetchUser(input.userId);

    return user;
  },
);

const machine = setup({
  types: {
    children: {} as {
      fetch1: 'fetcher';
      fetch2: 'fetcher';
    }
  }
  actors: { fetcher }
}).createMachine({
  invoke: {
    src: 'fetchData', // strongly typed
    id: 'fetch2', // strongly typed
    onDone: {
      actions: ({ event }) => {
        event.output; // strongly typed as { result: string }
      },
    },
    input: { userId: '42' }, // strongly typed
  },
});

Testing
The general strategy for testing actors is to send events and assert that the actor reaches an expected state, which can be observed either by:

Subscribing to its emitted snapshots via actor.subscribe(...)
Or reading the latest snapshot via actor.getSnapshot().
test('some actor', async () => {
  const actor = createActor(fromTransition((state, event) => {
    if (event.type === 'inc') {
      return { count: state.count + 1 }
    }
    return state;
  }, { count: 0 }));

  // Start the actor
  actor.start();

  // Send event(s)
  actor.send({ type: 'inc' });
  actor.send({ type: 'inc' });
  actor.send({ type: 'inc' });

  // Assert the expected result
  expect(actor.getSnapshot().context).toEqual({ count: 3 });
});

Actors cheatsheet
Cheatsheet: create an actor
import { createActor } from 'xstate';
import { someActorLogic } from './someActorLogic.ts';

// Create an actor from the actor logic
const actor = createActor(someActorLogic);

// Subscrube to an actor’s snapshot values and log them
actor.subscribe((snapshot) => {
  console.log(snapshot);
});

// Start the actor system
actor.start();

// Now the actor can receive events
actor.send({ type: 'someEvent' });

// Stops the root actor, actor system, and actors in the system
actor.stop();

Cheatsheet: state machine logic
import { createMachine, createActor } from 'xstate';

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: {},
    active: {},
  },
});

const toggleActor = createActor(toggleMachine);

toggleActor.subscribe((snapshot) => {
  // snapshot is the machine’s state
  console.log('state', snapshot.value);
  console.log('context', snapshot.context);
});
toggleActor.start();
// Logs 'inactive'
toggleActor.send({ type: 'toggle' });
// Logs 'active'

Cheatsheet: promise logic
import { fromPromise, createActor } from 'xstate';

const promiseLogic = fromPromise(() => {
  return fetch('https://example.com/...').then((data) => data.json());
});

const promiseActor = createActor(promiseLogic);
promiseActor.subscribe((snapshot) => {
  console.log(snapshot);
});
promiseActor.start();


Cheatsheet: transition function logic
import { fromTransition, createActor } from 'xstate';

const transitionLogic = fromTransition(
  (state, event) => {
    if (event.type === 'increment') {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    return state;
  },
  { count: 0 },
);

const transitionActor = createActor(transitionLogic);
transitionActor.subscribe((snapshot) => {
  console.log(snapshot);
});
transitionActor.start();
// => {
//   status: 'active',
//   context: { count: 0 },
//   ...
// }

transitionActor.send({ type: 'increment' });
// => {
//   status: 'active',
//   context: { count: 1 },
//   ...
// }

Cheatsheet: observable logic
import { fromObservable, createActor } from 'xstate';
import { interval } from 'rxjs';

const secondLogic = fromObservable(() => interval(1000));

const secondActor = createActor(secondLogic);

secondActor.subscribe((snapshot) => {
  console.log(snapshot.context);
});

secondActor.start();
// At every second:
// Logs 0
// Logs 1
// Logs 2
// ...

Cheatsheet: event observable logic
import { setup, fromEventObservable, createActor } from 'xstate';
import { fromEvent } from 'rxjs';

const mouseClickLogic = fromEventObservable(() =>
  fromEvent(document.body, 'click') as Subscribable<EventObject>
);

const canvasMachine = setup({
  actors: {
    mouseClickLogic
  }
}).createMachine({
  invoke: {
    // Will send mouse click events to the canvas actor
    src: 'mouseClickLogic',
  },
});

const canvasActor = createActor(canvasMachine);
canvasActor.start();

Cheatsheet: callback logic
import { fromCallback, createActor } from 'xstate';

const callbackLogic = fromCallback(({ sendBack, receive }) => {
  let lockStatus = 'unlocked';

  const handler = (event) => {
    if (lockStatus === 'locked') {
      return;
    }
    sendBack(event);
  };

  receive((event) => {
    if (event.type === 'lock') {
      lockStatus = 'locked';
    } else if (event.type === 'unlock') {
      lockStatus = 'unlocked';
    }
  });

  document.body.addEventListener('click', handler);

  return () => {
    document.body.removeEventListener('click', handler);
  };
});
