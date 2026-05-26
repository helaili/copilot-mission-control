<script setup lang="ts">
const emit = defineEmits<{ toggleDrawer: [] }>()

const { isLoggedIn, userName, login, logout } = useAuth()
const { appName } = useAppConfig()
</script>

<template>
  <v-app-bar color="#24292f" elevation="0" :height="56">
    <!-- Hamburger — visible only on mobile -->
    <v-app-bar-nav-icon
      color="white"
      class="d-flex d-sm-none"
      aria-label="Toggle navigation"
      @click="emit('toggleDrawer')"
    />

    <!-- Logo -->
    <v-app-bar-title class="flex-grow-0 pr-4">
      <div class="d-flex align-center ga-2">
        <v-icon color="white" size="28">mdi-rocket-launch</v-icon>
        <span class="text-white text-body-1 font-weight-semibold">
          {{ appName }}
        </span>
      </div>
    </v-app-bar-title>

    <v-spacer />

    <!-- Right-side user area -->
    <template #append>
      <div class="d-flex align-center mr-2">
        <!-- Logged-out: sign-in button -->
        <v-btn
          v-if="!isLoggedIn"
          variant="outlined"
          color="white"
          size="small"
          rounded="md"
          class="text-none"
          @click="login"
        >
          Sign in
        </v-btn>

        <!-- Logged-in: avatar + dropdown -->
        <v-menu v-else location="bottom end" :offset="8">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon
              variant="text"
              aria-label="User menu"
              :ripple="false"
            >
              <v-avatar size="32" color="#539bf5">
                <span class="text-caption font-weight-bold text-white">
                  {{ userName.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>
            </v-btn>
          </template>

          <v-card min-width="220" rounded="lg" elevation="8" border>
            <!-- User info header -->
            <v-list-item class="pa-3">
              <v-list-item-title class="text-body-2 font-weight-bold">
                {{ userName }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption text-medium-emphasis">
                Signed in
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider />

            <v-list density="compact" nav class="pa-1">
              <v-list-item
                prepend-icon="mdi-account-outline"
                title="Your profile"
                rounded="md"
              />
              <v-list-item
                prepend-icon="mdi-cog-outline"
                title="Settings"
                rounded="md"
              />
            </v-list>

            <v-divider />

            <v-list density="compact" nav class="pa-1">
              <v-list-item
                prepend-icon="mdi-logout"
                title="Sign out"
                rounded="md"
                @click="logout"
              />
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>
