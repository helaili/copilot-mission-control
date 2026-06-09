export const useEnterprise = () => {
  const { data } = useFetch('/api/enterprise')

  const enterpriseName = computed(() => data.value?.name ?? null)
  const enterpriseSlug = computed(() => data.value?.slug ?? null)

  return { enterpriseName, enterpriseSlug }
}
