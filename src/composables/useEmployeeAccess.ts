import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

export type EmployeeRow = {
  id?: number
  user_id?: number | null
  name?: string
  status?: string
  [key: string]: unknown
}

/** Aligns UI with backend: managers act on any employee; members only on linked profile. */
export function useEmployeeAccess() {
  const auth = useAuthStore()

  const isManager = computed(
    () => auth.activeMembership?.role === 'owner' || auth.activeMembership?.role === 'admin',
  )

  function linkedEmployeeId(employees: EmployeeRow[] | null | undefined): number | null {
    const userId = auth.user?.id
    if (!userId || !employees?.length) return null
    const match = employees.find((e) => Number(e.user_id) === userId)
    return match?.id != null ? Number(match.id) : null
  }

  function employeesForAction(employees: EmployeeRow[] | null | undefined): EmployeeRow[] {
    const list = employees ?? []
    if (isManager.value) return list
    const id = linkedEmployeeId(list)
    if (id == null) return []
    return list.filter((e) => Number(e.id) === id)
  }

  function canActOnEmployee(employeeId: number, employees: EmployeeRow[] | null | undefined): boolean {
    if (isManager.value) return true
    return linkedEmployeeId(employees) === employeeId
  }

  return { isManager, linkedEmployeeId, employeesForAction, canActOnEmployee }
}
