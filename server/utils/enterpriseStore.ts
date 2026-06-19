import type { EnterpriseInfo } from './githubApp'

let _enterpriseInfo: EnterpriseInfo | null = null

export function setEnterpriseInfo(info: EnterpriseInfo | null): void {
  _enterpriseInfo = info
}

export function getEnterpriseInfo(): EnterpriseInfo | null {
  return _enterpriseInfo
}
