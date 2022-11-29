---
sidebar_position: 8
---

# updateModernConfig

Update the `modernConfig` field in `package.json`.

This method is available on the `onForged` time to live API parameter.

Its type is defined as:

```ts
export type ForgedAPI = {
  updateModernConfig: (updateInfo: Record<string, any>) => Promise<void>;
  ...
};
```

## updateInfo

Field update information.

:::info
This function is the package of updateJSONFile, which will automatically update the `modernConfig` field of `package.json`. Just fill in the update information relative to `modernConfig` in the updateInfo.
:::