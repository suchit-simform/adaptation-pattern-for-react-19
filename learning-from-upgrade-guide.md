# React@19

## Behavior of component sibling render inside Suspense has changed

- ref: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense

## New React dom static Apis has been introduce

- I think like react now going to support major render pattern
  - client
  - server
  - static

## ref as Props rather than forwardRef

## cleanup function for refs available

- for removing runtime listener and observer
  https://teams.microsoft.com/l/message/19:b252c360837244b29e95b65903ca78cd@thread.skype/1762407624139?tenantId=f4814d23-3835-4d87-a7dc-57a19c04684a&groupId=2a8f5452-f24d-4a10-b47d-ee38464e2980&parentMessageId=1762407624139&teamName=React%20%2B%20Full%20Stack&channelName=Training%20Session&createdTime=1762407624139

## Support for document Metadata

- check code
- Note: but still react-helmet library would be suggested

## support for `async` scripts

- this would help to initial page load and other script for tracking purpose would really helpful this update

```tsx
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // won't lead to duplicate script in the DOM
    </body>
  </html>
}
```

## Support for preloading resources

### Usage in project I think

- there few fonts, assets need to preload for better performance and lighthouse score for seo
- this below would be really drastic change in your score if you are currently working on this task then

### Before:

```tsx
import { prefetchDNS, preconnect, preload, preinit } from "react-dom";
function MyComponent() {
  preinit("https://.../path/to/some/script.js", { as: "script" }); // loads and executes this script eagerly
  preload("https://.../path/to/font.woff", { as: "font" }); // preloads this font
  preload("https://.../path/to/stylesheet.css", { as: "style" }); // preloads this stylesheet
  prefetchDNS("https://..."); // when you may not actually request anything from this host
  preconnect("https://..."); // when you will request something but aren't sure what
}
```

### After:

```html
<!-- the above would result in the following DOM/HTML -->
<html>
  <head>
    <!-- links/scripts are prioritized by their utility to early loading, not call order -->
    <link rel="prefetch-dns" href="https://..." />
    <link rel="preconnect" href="https://..." />
    <link rel="preload" as="font" href="https://.../path/to/font.woff" />
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css" />
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

## Direct Context usage

```tsx
const ThemeContext = createContext("");

function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```

## Improve error handling

- ? there was huge error logging inside dev mode has changes as per react@19 update
  - in dev mode we now get log more context then previous component error

### New Functions add `onUncaughtError` and `onCaughtError`

- Uncaught Errors: Errors that are not caught by an Error Boundary are reported to window.reportError.
- Caught Errors: Errors that are caught by an Error Boundary are reported to console.error.
- `onRecoverableError` I found this function to but still need to learn about this point what it do

### Possible Use case (Pick from documentation)

> Together with `onUncaughtError` and `onRecoverableError`, you can can implement your own error reporting system:

### Example:

1. suppose if you want to handle and verify how many error has been caught by error boundary successfully
2. how many error got uncaught
3. how many error could be able to recover

### Reference study

1. https://react.dev/blog/2024/12/05/react-19#error-handling
2. https://react.dev/reference/react-dom/client/createRoot#error-logging-in-production

## Hurry! PropsType remove and even defaultProps also remove from library

---

# React@19.2

## `<Activity>` component

- modes:
  - `hidden:` hides the children, unmounts effects, and defers all updates until React has nothing left to work on.
  - `visible:` shows the children, mounts effects, and allows updates to be processed normally.
