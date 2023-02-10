# Imports resolver

JS library to parse sources and gather used imports and load it from certain source

It uses esprima-next to build list of used imports

```
npm install --save imports_resolver
```

then usage ImportResolver:

```typescript
import {ImportResolver} from 'imports_resolver'

const resolver = new ImportResolver({
    baseUrl : 'some_your_endpoint',
    handler : (module, content) => {
        ...
        some code to process downloaded content
        ...
    }
});
resolver.resolveDependencies(`
    import {lib} from 'lib';
    
    const result = lib.do();
`);
```

then usage FileProcessor:

```typescript

import {FileProcessor} from "imports_resolver";

const processor = new FileProcessor();

const imports = processor.process(`
    import {lib} from 'lib';
    
    const result = lib.do();
`);

imports.forEach(importStmt => {
    console.log(importStmt);
})

```