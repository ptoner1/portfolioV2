import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
    // default == directory name
    name: 'say-hello',
    // default == ./handler.ts
    entry: './handler.ts'
})
