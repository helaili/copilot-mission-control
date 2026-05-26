<script setup lang="ts">
const drawerOpen = ref(false)
</script>

<template>
  <v-app>
    <AppHeader @toggle-drawer="drawerOpen = !drawerOpen" />
    <AppSidebar v-model:open="drawerOpen" />

    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
