<script setup lang="ts">
import LegalDocumentPage from '@/components/legal/LegalDocumentPage.vue'
import { LEGAL_LAST_UPDATED, privacySections } from '@/content/legal-id'
</script>

<template>
  <LegalDocumentPage
    title="Kebijakan Privasi"
    description="Cara Hadirin mengumpulkan, menggunakan, dan melindungi data pribadi pengguna serta karyawan yang tercatat di workspace."
    :last-updated="LEGAL_LAST_UPDATED"
    :sections="privacySections"
  />
</template>
