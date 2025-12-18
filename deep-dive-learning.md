# Deep dive learning about new updates

## `startTransition`

- is introduce to update certain state update as not urgent
- problem: due to render task blocked the main thread, could not be able to handle any user interaction at this point,
  - which lead to UI un-responsive
  - visual feedback delay

## how can we achieve transition inside react ?

- we can achieve with multiple approach

1. startTransition
2. passing action attribute inside form tag
3. passing formAction attribute inside form tag
4. useActionState approach which pass action inside form with action attribute
5. direct pass async function inside action attribute inside form tag

## `use` api usage

1. replacement of `useContext`
2. if you want to await some promise we can use that `use(new Promise(resolve => setTimeout(() => {resolve()}, 1000)))`
3. > Fun fact: we can call it conditionally

## `ref` as a props

1. > fun fact: also provide clean up function, which help to remove event listener

## Stylesheet Support per component

1. which would be really help for a seo
2. even css file precedence to retain
