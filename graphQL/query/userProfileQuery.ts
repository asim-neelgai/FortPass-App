import { QueryFunctionReturnType } from '../hooks/useQuery'

const createUser = (): QueryFunctionReturnType => ({
  name: 'createUser',
  type: 'mutation',
  query: `#graphql
      mutation createUser(
        $input: CreateUserInput!
      ) {
        createUser(input: $input) {
          id
        }
      }
    `
})

export default {
  createUser
}
