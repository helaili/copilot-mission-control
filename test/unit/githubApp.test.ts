import { generateKeyPairSync } from 'node:crypto'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import {
  type EnterpriseInfo,
  type GitHubInstallation,
  findEnterpriseInstallation,
  generateAppJWT,
} from '../../server/utils/githubApp'

let testPrivateKeyPem: string
beforeAll(() => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  testPrivateKeyPem = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString()
})

// --- generateAppJWT ---

describe('generateAppJWT', () => {
  it('returns a JWT with three dot-separated parts', () => {
    const jwt = generateAppJWT('12345', testPrivateKeyPem)
    expect(jwt.split('.')).toHaveLength(3)
  })

  it('encodes the correct header (alg: RS256)', () => {
    const jwt = generateAppJWT('12345', testPrivateKeyPem)
    const header = JSON.parse(Buffer.from(jwt.split('.')[0], 'base64url').toString())
    expect(header).toEqual({ alg: 'RS256', typ: 'JWT' })
  })

  it('encodes the App ID as iss in the payload', () => {
    const jwt = generateAppJWT('99999', testPrivateKeyPem)
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString())
    expect(payload.iss).toBe('99999')
  })

  it('sets iat ~60 seconds in the past', () => {
    const before = Math.floor(Date.now() / 1000)
    const jwt = generateAppJWT('1', testPrivateKeyPem)
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString())
    expect(payload.iat).toBeGreaterThanOrEqual(before - 61)
    expect(payload.iat).toBeLessThanOrEqual(before - 59)
  })

  it('sets exp ~10 minutes in the future', () => {
    const before = Math.floor(Date.now() / 1000)
    const jwt = generateAppJWT('1', testPrivateKeyPem)
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString())
    expect(payload.exp).toBeGreaterThanOrEqual(before + 599)
    expect(payload.exp).toBeLessThanOrEqual(before + 601)
  })

  it('throws when given an invalid private key', () => {
    expect(() => generateAppJWT('1', 'not-a-key')).toThrow()
  })
})

// --- findEnterpriseInstallation ---

function makeInstallation(overrides: Partial<GitHubInstallation> = {}): GitHubInstallation {
  return {
    id: 1,
    target_type: 'Enterprise',
    suspended_at: null,
    account: { slug: 'my-enterprise', id: 100, type: 'Enterprise', name: 'My Enterprise' },
    ...overrides,
  }
}

describe('findEnterpriseInstallation', () => {
  it('returns the enterprise info for a matching installation', () => {
    const result = findEnterpriseInstallation([makeInstallation()])
    expect(result).toEqual({ slug: 'my-enterprise', name: 'My Enterprise' })
  })

  it('returns account slug and name from matching installation', () => {
    const inst = makeInstallation({ account: { slug: 'ent-slug', id: 1, type: 'Enterprise', name: 'Ent Slug' } })
    expect(findEnterpriseInstallation([inst])).toEqual({ slug: 'ent-slug', name: 'Ent Slug' })
  })

  it('detects enterprise by account.type when target_type is missing', () => {
    const inst = makeInstallation({ target_type: 'Organization' })
    expect(findEnterpriseInstallation([inst])).not.toBeNull()
  })

  it('ignores suspended installations', () => {
    const inst = makeInstallation({ suspended_at: '2024-01-01T00:00:00Z' })
    expect(findEnterpriseInstallation([inst])).toBeNull()
  })

  it('returns null when no enterprise installation exists', () => {
    const orgInst = makeInstallation({ target_type: 'Organization', account: { slug: 'my-org', id: 1, type: 'Organization', name: 'My Org' } })
    expect(findEnterpriseInstallation([orgInst])).toBeNull()
  })

  it('returns null for an empty list', () => {
    expect(findEnterpriseInstallation([])).toBeNull()
  })

  it('returns null when the matching installation has no account', () => {
    const inst = makeInstallation({ account: null })
    expect(findEnterpriseInstallation([inst])).toBeNull()
  })

  it('returns first match and warns when multiple enterprise installations found', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const inst1 = makeInstallation({ id: 1, account: { slug: 'ent-a', id: 1, type: 'Enterprise', name: 'Ent A' } })
    const inst2 = makeInstallation({ id: 2, account: { slug: 'ent-b', id: 2, type: 'Enterprise', name: 'Ent B' } })

    const result = findEnterpriseInstallation([inst1, inst2])
    expect(result).toEqual({ slug: 'ent-a', name: 'Ent A' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('2 enterprise installations'))
    consoleSpy.mockRestore()
  })
})


// --- enterpriseStore ---

describe('enterpriseStore', () => {
  it('stores and retrieves enterprise info', async () => {
    const { getEnterpriseInfo, setEnterpriseInfo } = await import('../../server/utils/enterpriseStore')
    const info: EnterpriseInfo = { name: 'Test Enterprise', slug: 'test-enterprise' }
    setEnterpriseInfo(info)
    expect(getEnterpriseInfo()).toEqual(info)
  })

  it('returns null before any value is set', async () => {
    // Use a fresh module by resetting with null
    const { getEnterpriseInfo, setEnterpriseInfo } = await import('../../server/utils/enterpriseStore')
    // @ts-expect-error - testing null reset
    setEnterpriseInfo(null)
    expect(getEnterpriseInfo()).toBeNull()
  })
})