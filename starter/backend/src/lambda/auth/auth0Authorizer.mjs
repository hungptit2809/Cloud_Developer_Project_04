import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-3ca3p63exwsb7sny.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  if (!authHeader) throw new Error('No authorization header');
  if (!authHeader.toLowerCase().startsWith('bearer ')) throw new Error('Invalid authorization header');
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  logger.info('Start verification');
  // TODO: Implement token verification
  try {
    const res = await Axios.get(jwksUrl);
    const keys = res.data.keys.find(key => key.kid === jwt.header.kid);
    const certificate = certToPEM(keys.x5c[0]);
    return jsonwebtoken.verify(token, certificate, {algorithms: ['RS256']});
  } catch (error) {
      logger.error('Token verification error', { error });
  }
  return undefined;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

// genarate certificate 
function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n');
  return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
}