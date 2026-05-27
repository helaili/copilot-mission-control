<script setup lang="ts">
definePageMeta({ layout: 'marketing', auth: false })
useHead({ titleTemplate: '%s' })

const { appName } = useAppConfig()

const features = [
  {
    icon: 'mdi-chart-bar',
    color: 'primary',
    title: 'Usage Analytics',
    description: 'Visualise Copilot adoption across your organisation with detailed, real-time metrics.',
  },
  {
    icon: 'mdi-currency-usd',
    color: 'success',
    title: 'Budget Management',
    description: 'Set spending limits per team or repository and receive alerts before budgets are exceeded.',
  },
  {
    icon: 'mdi-account-group',
    color: 'info',
    title: 'Seat Allocation',
    description: 'Track active seats, identify unused licences, and optimise costs across your organisation.',
  },
]
</script>

<template>
  <!-- Hero -->
  <section class="hero-section d-flex align-center justify-center text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="7">
          <v-icon size="72" color="primary" class="mb-6">mdi-rocket-launch</v-icon>

          <h1 class="text-h3 text-sm-h2 font-weight-bold mb-4">
            {{ appName }}
          </h1>

          <p class="text-h6 text-medium-emphasis font-weight-regular mb-8">
            Monitor your GitHub Copilot usage, manage seat budgets, and keep your
            organisation's AI spending on track — all in one place.
          </p>

          <v-btn
            color="primary"
            size="large"
            rounded="lg"
            elevation="0"
            href="/auth/github"
            prepend-icon="mdi-github"
            class="text-none px-8"
          >
            Sign in with GitHub
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <!-- Features -->
  <section class="py-16">
    <v-container>
      <v-row justify="center" class="mb-10">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold">Everything you need to stay in control</h2>
        </v-col>
      </v-row>

      <v-row justify="center" class="ga-4 ga-md-0">
        <v-col
          v-for="feature in features"
          :key="feature.title"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card rounded="xl" variant="tonal" height="100%" class="pa-2">
            <v-card-text class="text-center pa-6">
              <v-icon :color="feature.color" size="48" class="mb-4">{{ feature.icon }}</v-icon>
              <div class="text-h6 font-weight-bold mb-2">{{ feature.title }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ feature.description }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <!-- CTA -->
  <section class="py-16 bg-surface-variant">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6" class="text-center">
          <h2 class="text-h4 font-weight-bold mb-4">Ready to take control?</h2>
          <p class="text-body-1 text-medium-emphasis mb-8">
            Sign in with your GitHub account to get started in seconds.
          </p>
          <v-btn
            color="primary"
            size="large"
            rounded="lg"
            elevation="0"
            href="/auth/github"
            prepend-icon="mdi-github"
            class="text-none px-8"
          >
            Get started
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: calc(100vh - 56px);
  background: linear-gradient(160deg, rgb(var(--v-theme-surface)) 60%, rgba(var(--v-theme-primary), 0.06) 100%);
}
</style>