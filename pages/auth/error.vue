<script setup lang="ts">
useHead({
  title: 'Authentication error',
})
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="6" lg="4">
      <v-card rounded="xl" border elevation="2" class="pa-6 text-center">
        <v-icon color="error" size="48" class="mb-4">
          mdi-alert-circle-outline
        </v-icon>

        <h1 class="text-h5 font-weight-bold mb-2">
          GitHub sign-in failed
        </h1>

        <p class="text-body-2 text-medium-emphasis mb-6">
          We could not complete the GitHub OAuth flow. Please try signing in again.
        </p>

        <v-btn color="primary" href="/auth/github" rounded="lg">
          Sign in with GitHub
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
