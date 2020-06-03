# react-apollo-idle-cache-eviction

Hooks for performing cache eviction when the user is detected to be idle.

[![NPM](https://img.shields.io/npm/v/react-apollo-idle-cache-eviction.svg)](https://www.npmjs.com/package/react-apollo-idle-cache-eviction)

## Install

```bash
npm install --save react-apollo-idle-cache-eviction
```

## Usage

```tsx
import React, { Component } from 'react'

import { useIdleCacheEviction } from 'react-apollo-idle-cache-eviction'

const AppRoot = () => {
  useIdleCacheEviction({
    checkInterval: 10 * 1000,
    minimumIdleMs: 30 * 1000,
    onCacheClear: () => console.log("Cleared!")
  });

  return (
    <div>This is a page.</div>
  )
}

```

## License

MIT © [Senney](https://github.com/Senney)
