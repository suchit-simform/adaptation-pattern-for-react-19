Learning from video:

Prerequisites:

1. First we have to migrate to react@18.3 before we migrate to 19

Everything you need to know about react 19

## Short summary

1. New Hooks
   1. useFormStatus
   2. useActionState
   3. useOptimisticUI
2. New features
   1. React Actions
   2. React Compilers
3. Updates
   1. Metadata
   2. Stylessheets
   3. Error Logging
   4. Preloading Apis
4. Server Api
   1. React Server Component
5. Client Api
   1. startTransition accepts async functions

## What's new?

1. New features
   1. React Compiler
   2. React Actions
      1. def: function that use async transition are called actions (Need to check with docs)
         1. yes also supported on server
      2. which easier to handle form
         1. familiar with php or remix action form look like
      3. in react@18 there was new feature call start transition
         1. so putting certain task which are not urgent we can give this task to start transition
         2. ex: search field
            1. text update for control state (urgent task for user behavior)
            2. to display suggestion we also need to make an api call that we can wrap in start transition
         3. difference
            1. in react 19 start transition support async api , while not supported in react 18
      4. Props:
         1. auto form submit manual form handle and submit reduce that boilerplate code
2. New hooks
   1. `const { pending, data, method, action } = useFormState()`
      1. info of a last form submission
      2. pending: a boolean. true if parent `<form>` is pending submission
      3. data: FormData
      4. method: POST, PUT, etc
      5. action: actions
      6. Cons 1. Only inside form parent would be working, if we call `useFormState` at same level it would not work 2. we have to create child `Submit` component and in that we can consume `useFormState`.
   2. `const [state, formAction] = useActionState(fn, initialState, permaLink)`
      1. `fn`: function to be called when a form submit
      2. `permalink`: a string containing the page URL that this form modifies
      3. `state`: initialState during first render. data return by form afterwards
      4. `formAction`: action for your form component
      5. update state based on actions
   3. `const [optimisticState, addOptimistic] = useOptimistic(initialState, updateFn)`
      1. optimistically update UI
3. New apis
   1. `use` read resources
      1. we can use to read Context
      2. we can use to read promise
         1. cons: dose not support this in render
      3. finally we can call this conditionally
4. Changes
   1. ref is a prop `rather than forwardRef we can direct use ref`
   2. Better Errors
   3. Render `<Context>` instead of `<Context.Provider>`
   4. ref cleanup
   5. Metadata
      1. you can have Metadata for each component
      2. with in the component it self which would be add in a head runtime
   6. Better support for stylesheets
      1. which stylesheet get what precedence
      2. due to metaData support we can dynamically add link in the component to load that specific component

## Extra

1. How the form action would work in deployed version?
