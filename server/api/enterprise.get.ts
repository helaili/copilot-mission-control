export default defineEventHandler(() => {
  return getEnterpriseInfo() ?? { name: null, slug: null }
})
