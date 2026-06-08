<script setup lang="ts">
import { useDisplay } from 'vuetify'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { xs, lgAndUp } = useDisplay()

// useDisplay() values are unreliable during SSR (no window).
// Defer to client-side only to avoid hydration mismatches that leave
// the component in a broken state.
const mounted = ref(false)
onMounted(() => { mounted.value = true })

// Mobile (xs): temporary overlay drawer, controlled by open prop
// Tablet (sm-md): permanent rail — icons only
// Desktop (lg+): permanent full — icons + text
const isTemporary = computed(() => mounted.value && xs.value)
const isRail = computed(() => mounted.value && !xs.value && !lgAndUp.value)

const drawerModel = computed({
  get: () => (isTemporary.value ? props.open : true),
  set: (val: boolean) => { if (isTemporary.value) emit('update:open', val) },
})

const navItems = [
  { title: 'Summary', icon: 'mdi-view-dashboard', to: '/summary' },
  { title: 'Usage', icon: 'mdi-chart-bar', to: '/usage' },
  { title: 'Budgets', icon: 'mdi-wallet', to: '/budgets' },
]
</script>

<template>
  <v-navigation-drawer
    v-model="drawerModel"
    :rail="isRail"
    :temporary="isTemporary"
    :permanent="!isTemporary"
    color="#f6f8fa"
    border="e"
    width="240"
  >
    <!-- Navigation items -->
    <v-list density="compact" nav class="pa-2">
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        rounded="md"
        active-class="nav-active"
        class="nav-item mb-1"
        :aria-label="item.title"
      >
        <v-tooltip activator="parent" :text="item.title" :disabled="!isRail" location="end" />
      </v-list-item>
    </v-list>

    <!-- Footer help link -->
    <template #append>
      <v-divider />
      <div class="pa-2">
        <v-list-item
          prepend-icon="mdi-help-circle-outline"
          title="Help"
          rounded="md"
          class="nav-item"
          aria-label="Help"
        >
          <v-tooltip activator="parent" text="Help" :disabled="!isRail" location="end" />
        </v-list-item>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.nav-item :deep(.v-list-item__prepend .v-icon) {
  color: #57606a;
}

.nav-item:hover :deep(.v-list-item__prepend .v-icon) {
  color: #24292f;
}

.nav-active {
  background-color: #dde4ed !important;
  font-weight: 600;
}

.nav-active :deep(.v-list-item__prepend .v-icon) {
  color: #24292f !important;
}

.nav-active :deep(.v-list-item-title) {
  color: #24292f !important;
  font-weight: 600;
}
</style>
