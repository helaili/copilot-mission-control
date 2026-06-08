import { createSign } from 'node:crypto'

export interface GitHubInstallationAccount {
  login: string
  id: number
  type: string
  name?: string
}

export interface GitHubInstallation {
  id: number
  target_type: string
  suspended_at: string | null
  account: GitHubInstallationAccount | null
}

export interface EnterpriseInfo {
  name: string
  slug: string
}

/**
 * Generates a GitHub App JWT for authenticating as the App itself.
 * The private key must be a PEM-formatted RSA private key string.
 */
export function generateAppJWT(appId: string, privateKeyPem: string): string {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iat: now - 60, // 60 s in the past to account for clock drift
    exp: now + 600, // 10 minutes (GitHub App max)
    iss: appId,
  })).toString('base64url')

  const signingInput = `${header}.${payload}`
  const sign = createSign('RSA-SHA256')
  sign.update(signingInput)
  sign.end()
  const signature = sign.sign(privateKeyPem, 'base64url')

  return `${signingInput}.${signature}`
}

/**
 * Fetches all installations for the GitHub App, handling pagination.
 */
export async function fetchAllInstallations(jwt: string): Promise<GitHubInstallation[]> {
  const installations: GitHubInstallation[] = []
  let page = 1

  while (true) {
    const batch = await $fetch<GitHubInstallation[]>(
      `https://api.github.com/app/installations?per_page=100&page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'copilot-mission-control',
        },
      },
    )

    if (!batch || batch.length === 0) break
    installations.push(...batch)
    if (batch.length < 100) break
    page++
  }

  return installations
}

/**
 * Finds enterprise installations, skipping suspended ones.
 * Returns the first match, logging a warning if multiple are found.
 */
export function findEnterpriseInstallation(installations: GitHubInstallation[]): EnterpriseInfo | null {
  const enterpriseInstalls = installations.filter(
    inst =>
      inst.suspended_at === null &&
      (inst.target_type === 'Enterprise' || inst.account?.type === 'Enterprise'),
  )

  if (enterpriseInstalls.length === 0) return null

  if (enterpriseInstalls.length > 1) {
    console.warn(
      `[github-app] Found ${enterpriseInstalls.length} enterprise installations. Using the first one: "${enterpriseInstalls[0].account?.login}"`,
    )
  }

  const account = enterpriseInstalls[0].account
  if (!account) return null

  return {
    slug: account.login,
    name: account.name ?? account.login,
  }
}
