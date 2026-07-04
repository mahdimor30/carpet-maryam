// import { getDb } from '#/db'
// import { todos } from '#/db/schema'
// import { createServerFn } from '@tanstack/react-start'

// const db = getDb()

// export const crateTodo = createServerFn({
//   method: 'POST',
// }).handler(async () => {
//   await db.insert(todos).values({
//     title: 'test',
//   })
// })

// export const getTodo = createServerFn().handler(async () => {
//   const data = await db.query.todos.findMany({})
//   return data
// })
