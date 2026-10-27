<script setup lang="ts">
import LegalDocumentPage from '@/components/legal/LegalDocumentPage.vue'
import { LEGAL_LAST_UPDATED, termsSections } from '@/content/legal-id'
</script>

<template>
  <LegalDocumentPage
    title="Syarat Layanan"
    description="Ketentuan penggunaan aplikasi presensi Hadirin untuk perusahaan dan pengguna terdaftar."
    :last-updated="LEGAL_LAST_UPDATED"
    :sections="termsSections"
  />
</template>
