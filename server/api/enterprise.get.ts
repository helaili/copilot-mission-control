import { getEnterpriseInfo } from "../utils/enterpriseStore"

export default defineEventHandler(() => {
  return getEnterpriseInfo() ?? { name: null, slug: null }
})
