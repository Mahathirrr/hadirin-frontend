export function deferAction(action: () => void, event?: Event) {
  event?.preventDefault()
  window.setTimeout(action, 0)
}

/** Wait for dropdown/popover teardown before opening a modal dialog. */
export function deferDialogAction(action: () => void, event?: Event) {
  event?.preventDefault()
  window.setTimeout(action, 150)
}

export function deferOpen(openRef: { value: boolean }, event?: Event) {
  deferAction(() => {
    openRef.value = true
  }, event)
}

export function deferDialogOpen(openRef: { value: boolean }, event?: Event) {
  deferDialogAction(() => {
    openRef.value = true
  }, event)
}

/** Ignore dismiss events fired immediately after a dialog opens. */
export function createDialogDismissGuard(cooldownMs = 450) {
  let suppressUntil = 0

  function markOpened() {
    suppressUntil = Date.now() + cooldownMs
  }

  function shouldSuppressDismiss() {
    return Date.now() < suppressUntil
  }

  function guardDismiss(nextOpen: boolean, emit: (value: boolean) => void) {
    if (!nextOpen && shouldSuppressDismiss()) return
    emit(nextOpen)
  }

  function guardOutsideEvent(event: Event) {
    if (shouldSuppressDismiss()) event.preventDefault()
  }

  return { markOpened, guardDismiss, guardOutsideEvent }
}
