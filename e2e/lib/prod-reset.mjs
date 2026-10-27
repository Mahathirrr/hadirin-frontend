import { execFileSync } from 'node:child_process'

const SSH = [
  'ssh',
  '-i',
  process.env.E2E_SSH_KEY ?? `${process.env.HOME}/.ssh/id_ed25519`,
  '-p',
  process.env.E2E_SSH_PORT ?? '30890',
  '-o',
  'BatchMode=yes',
  '-o',
  'StrictHostKeyChecking=accept-new',
  `root@${process.env.E2E_SSH_HOST ?? '141.11.190.106'}`,
]

/** Hapus absensi hari ini (Asia/Jakarta) agar tes member check-in bisa diulang — showcase only. */
export function resetTodayAttendanceForEmails(emails) {
  if (!emails.length) return
  const list = emails.map((e) => `'${e.replace(/'/g, "''")}'`).join(', ')
  const sql = `UPDATE attendances AS a SET deleted_at = NOW(), updated_at = NOW() FROM employees AS e WHERE a.employee_id = e.id AND e.email IN (${list}) AND a.deleted_at IS NULL AND (a.check_in AT TIME ZONE 'Asia/Jakarta')::date = (NOW() AT TIME ZONE 'Asia/Jakarta')::date;`

  const remote = `set -a && source /opt/hadirin/backend/.env && set +a && psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c ${JSON.stringify(sql)}`
  execFileSync(SSH[0], [...SSH.slice(1), remote], { stdio: 'inherit' })
}
