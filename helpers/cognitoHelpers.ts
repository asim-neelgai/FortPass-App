import { CognitoIdentityProviderClient, ConfirmSignUpCommand, GetUserCommand, GetUserCommandOutput, InitiateAuthCommand, RespondToAuthChallengeCommand, RespondToAuthChallengeResponse, SetUserMFAPreferenceCommand, SignUpCommand, SignUpCommandOutput, SoftwareTokenMfaSettingsType, VerifySoftwareTokenCommand, VerifySoftwareTokenCommandOutput, ResendConfirmationCodeCommandOutput, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'
import awsmobile from '@/aws-exports'

const clientId = awsmobile.aws_user_pools_web_client_id
const region = awsmobile.aws_project_region

type InitiateLoginResponse = {
  success: true
  accessToken?: string
  refreshToken?: string
  cognitoSession?: string
} | {
  success: false
  error: string
}
interface ConfirmSignUpCommandOutput {
  success: boolean
  accessToken?: string
  error?: string
}

const initiateLogin = async (username: string, password: string, mfacode?: string): Promise<InitiateLoginResponse> => {
  const response = await (new CognitoIdentityProviderClient({
    region
  })).send(new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  }))
  if (response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
    if (mfacode == null) {
      return {
        success: true,
        cognitoSession: response.Session
      }
    } else {
      if (response.Session == null) {
        return {
          success: false,
          error: 'Session is null'
        }
      }
      const finalResponse = await respondToAuthChallenge(username, mfacode, response.Session)
      if (finalResponse.AuthenticationResult != null) {
        return {
          success: true,
          accessToken: finalResponse.AuthenticationResult.AccessToken,
          refreshToken: finalResponse.AuthenticationResult.RefreshToken
        }
      }
    }
  }
  if ((response.AuthenticationResult?.AccessToken == null) || (response.AuthenticationResult?.RefreshToken == null)) {
    return {
      success: false,
      error: 'Invalid access token or refresh token'
    }
  }
  return {
    success: true,
    accessToken: response.AuthenticationResult.AccessToken,
    refreshToken: response.AuthenticationResult.RefreshToken,
    cognitoSession: response.Session
  }
}

const respondToAuthChallenge = async (username: string, totpCode: string, session: string): Promise<RespondToAuthChallengeResponse> => {
  const response = await new CognitoIdentityProviderClient({
    region
  }).send(new RespondToAuthChallengeCommand({
    ClientId: clientId,
    ChallengeName: 'SOFTWARE_TOKEN_MFA',
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      SOFTWARE_TOKEN_MFA_CODE: totpCode
    }
  }))
  return response
}

const initiateRegister = async (
  email: string,
  password: string,
  passwordHint: string,
  name: string
): Promise<SignUpCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region
  }).send(
    new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'custom:passwordHint',
          Value: passwordHint
        }, {
          Name: 'name',
          Value: name
        }
      ]
    })
  )

  return response
}

const initiateConfirmation = async (
  username: string,
  confirmationCode: string,
  password: string
): Promise<ConfirmSignUpCommandOutput> => {
  try {
    const response = await new CognitoIdentityProviderClient({
      region
    }).send(
      new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: username,
        ConfirmationCode: confirmationCode
      })
    )

    if (response.$metadata.httpStatusCode === 200) {
      const loginResponse = await initiateLogin(username, password)

      if (loginResponse.success && loginResponse.accessToken !== undefined) {
        return {
          success: true,
          accessToken: loginResponse.accessToken
        }
      } else {
        return {
          success: false,
          error: 'Failed to get accessToken after confirmation.'
        }
      }
    } else {
      return {
        success: false,
        error: 'Confirmation failed.'
      }
    }
  } catch (error) {
    console.error('Error confirming sign up:', error)
    return {
      success: false,
      error: 'Error confirming sign up.'
    }
  }
}

const confirmMFA = async (
  username: string,
  confirmationCode: string
): Promise<ConfirmSignUpCommandOutput> => {
  try {
    const response = await new CognitoIdentityProviderClient({
      region
    }).send(
      new RespondToAuthChallengeCommand({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        ClientId: clientId,
        ChallengeResponses: {
          USERNAME: username,
          SOFTWARE_TOKEN_MFA_CODE: confirmationCode
        }
      })
    )

    if (response?.AuthenticationResult?.AccessToken !== undefined) {
      return {
        success: true,
        accessToken: response.AuthenticationResult.AccessToken
      }
    } else {
      return {
        success: false,
        error: 'Failed to confirm MFA.'
      }
    }
  } catch (error) {
    console.error('Error confirming MFA:', error)
    return {
      success: false,
      error: 'Error confirming MFA.'
    }
  }
}

const vallidateMFA = async (userCode: string, accessToken: string): Promise<VerifySoftwareTokenCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region
  }).send(new VerifySoftwareTokenCommand({
    AccessToken: accessToken,
    UserCode: userCode
  }))

  return response
}

const setUserMfaPreference = async (softwareTokenMfaSettings: SoftwareTokenMfaSettingsType, accessToken?: string): Promise<VerifySoftwareTokenCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region
  }).send(new SetUserMFAPreferenceCommand({
    AccessToken: accessToken,
    SoftwareTokenMfaSettings: softwareTokenMfaSettings
  }))
  return response
}

const mfaEnabled = async (accessToken: string): Promise<boolean> => {
  const response = await new CognitoIdentityProviderClient({
    region
  }).send(
    new GetUserCommand({
      AccessToken: accessToken
    })
  )
  const hasSoftwareTokenMFA = response.UserMFASettingList?.includes('SOFTWARE_TOKEN_MFA') ?? false
  return hasSoftwareTokenMFA
}
const userDetails = async (accessToken?: string): Promise<GetUserCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region
  }).send(
    new GetUserCommand({
      AccessToken: accessToken
    })
  )
  return response
}

const resendConfirmationCode = async (username: string): Promise<ResendConfirmationCodeCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region
  }).send(
    new ResendConfirmationCodeCommand({
      ClientId: clientId,
      Username: username
    })
  )
  return response
}

export default {
  initiateLogin,
  initiateRegister,
  initiateConfirmation,
  confirmMFA,
  vallidateMFA,
  setUserMfaPreference,
  mfaEnabled,
  userDetails,
  resendConfirmationCode
}
