export NUXT_GITHUB_APP_PRIVATE_KEY="$(base64 -i private-key.pem | tr -d '\n')"
sed -i '' '/^NUXT_GITHUB_APP_PRIVATE_KEY=/d' .env 
printf "NUXT_GITHUB_APP_PRIVATE_KEY=%s\n" "$NUXT_GITHUB_APP_PRIVATE_KEY" >> .env
