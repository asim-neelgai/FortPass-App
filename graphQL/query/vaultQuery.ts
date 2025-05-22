import { QueryFunctionReturnType } from '../hooks/useQuery'

const createVault = (): QueryFunctionReturnType => ({
  name: 'createVault',
  type: 'mutation',
  query: `#graphql
      mutation createVault(
        $input: CreateVaultInput!
      ) {
        createVault(input: $input) {
          id
          owner
        }
      }
    `
})

export default {
  createVault
}
