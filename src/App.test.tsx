/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AppLayout } from './components/layout/AppLayout'
import { MemoryRouter } from 'react-router-dom'

test('renders sidebar with navigation', () => {
    render(
        <MemoryRouter>
            <AppLayout />
        </MemoryRouter>
    )
    const navItem = screen.getByText(/Unread/i)
    expect(navItem).toBeInTheDocument()
})
