import { setEnterpriseInfo } from "../utils/enterpriseStore"

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const clientId = config.oauth?.github?.clientId
  const privateKeyBase64 = config.githubAppPrivateKey

  if (!clientId || !privateKeyBase64) {
    console.warn('[github-app] NUXT_OAUTH_GITHUB_CLIENT_ID or NUXT_GITHUB_APP_PRIVATE_KEY is not set. Skipping enterprise info retrieval.')
    return
  }

  try {
    const privateKeyPem = Buffer.from(privateKeyBase64, 'base64').toString('utf-8')
    const jwt = generateAppJWT(clientId, privateKeyPem)

    const installations = await fetchAllInstallations(jwt)
    const enterpriseInfo = findEnterpriseInstallation(installations)

    if (!enterpriseInfo) {
      console.warn('[github-app] No active enterprise installation found for this GitHub App.')
      return
    }

    setEnterpriseInfo(enterpriseInfo)
    process.env.ENTERPRISE_NAME = enterpriseInfo.name
    process.env.ENTERPRISE_SLUG = enterpriseInfo.slug

    console.log(`[github-app] Enterprise: "${enterpriseInfo.name}", slug: "${enterpriseInfo.slug}"`)
  }
  catch (err) {
    console.error('[github-app] Failed to retrieve enterprise information:', err)
  }
})
