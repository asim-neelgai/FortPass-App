import { QueryFunctionReturnType } from '../hooks/useQuery'

const createVaultAccessControl = (): QueryFunctionReturnType => ({
  name: 'createVaultAccessControl',
  type: 'mutation',
  query: `#graphql
      mutation createVaultAccessControl(
        $input: CreateVaultAccessControlInput!
      ) {
        createVaultAccessControl(input: $input) {
          id
          giverUserId
          grantedUserId
        }
      }
    `
})

export default {
  createVaultAccessControl
}
