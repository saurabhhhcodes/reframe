import React from 'react'
import { describe, afterEach, it, expect, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExportOverlay from '../ExportOverlay'

vi.mock('focus-trap-react', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('../LottiePlayer', () => ({
  default: () => <div data-testid="export-spinner" />,
}))

vi.mock('../TipCarousel', () => ({
  default: () => <div data-testid="export-tips" />,
}))

describe('ExportOverlay', () => {
  afterEach(() => {
    cleanup()
    document.body.style.overflow = ''
    vi.restoreAllMocks()
  })

  it('stays hidden while the editor is idle', () => {
    render(<ExportOverlay status="idle" progress={0} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /cancel export/i })).not.toBeInTheDocument()
  })

  it('shows engine loading progress without a cancel action', () => {
    render(<ExportOverlay status="loading-engine" progress={42} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /loading engine/i })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: /engine download progress/i })).toHaveAttribute(
      'aria-valuenow',
      '42',
    )
    expect(screen.queryByRole('button', { name: /cancel export/i })).not.toBeInTheDocument()
  })

  it('calls onCancel when the cancel button is clicked during export', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ExportOverlay
        status="exporting"
        progress={65}
        exportStartedAt={Date.now() - 3000}
        onCancel={onCancel}
      />,
    )

    expect(screen.getByRole('heading', { name: /exporting/i })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: /export progress/i })).toHaveAttribute(
      'aria-valuenow',
      '65',
    )

    await user.click(screen.getByRole('button', { name: /cancel export/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape is pressed while exporting', () => {
    const onCancel = vi.fn()

    render(
      <ExportOverlay
        status="exporting"
        progress={10}
        exportStartedAt={Date.now()}
        onCancel={onCancel}
      />,
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
