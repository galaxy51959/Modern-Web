---
sidebar_position: 1
---

# OnForged

`onForged` function is the generator plugin time to live function, which is usually used to define file type operations that will be performed after the completion of the base project solution file operation.

The method is available directly on the context.

Its type is defined as:

```ts
export type PluginForgedFunc = (
  api: ForgedAPI,
  inputData: Record<string, unknown>,
) => void | Promise<void>;

export interface IPluginContext {
  onForged: (func: PluginForgedFunc) => void;
  ...
}
```

## func

The onForged parameter is a callback function, and the function parameters are `api` and `inputData`.

### api

A list of supported functions in `onForged` time to live, specifically viewable [File API] (/docs/guides/topic-detail/generator/plugin/api/file/introduce) and [Enable function API] (/docs/guides/topic-detail/generator/plugin/api/new/introduce).


### inputData

Current user input, the user can be used to obtain the current input information and configuration information.