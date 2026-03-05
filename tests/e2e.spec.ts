import { test, expect } from '@playwright/test'

const USERS = {
  admin: { email: 'admin.e2e@example.com', password: 'AdminE2E!23', dashboardText: 'Admin Dashboard' },
  receptionist: { email: 'receptionist.e2e@example.com', password: 'Reception1!', dashboardText: "Reception Dashboard" },
  dentist: { email: 'dentist.e2e@example.com', password: 'Dentist1!', dashboardText: 'Dentist Dashboard' },
  patient: { email: 'e2e.patient+2@example.com', password: 'E2Epass123', dashboardText: 'Patient Dashboard' },
}

test.beforeEach(async ({ page }) => {
  // ensure starting from login page
  await page.goto('/patient/login')
})

test('admin signs in and sees admin dashboard', async ({ page }) => {
  const u = USERS.admin
  await page.fill('#email', u.email)
  await page.fill('#password', u.password)
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/staff/dashboard')
  await expect(page.locator('text=' + u.dashboardText)).toBeVisible({ timeout: 5000 })
})

test('receptionist signs in and sees receptionist dashboard', async ({ page }) => {
  const u = USERS.receptionist
  await page.fill('#email', u.email)
  await page.fill('#password', u.password)
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/staff/dashboard')
  await expect(page.locator('text=' + u.dashboardText)).toBeVisible({ timeout: 5000 })
})

test('dentist signs in and sees dentist dashboard', async ({ page }) => {
  const u = USERS.dentist
  await page.fill('#email', u.email)
  await page.fill('#password', u.password)
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/staff/dashboard')
  await expect(page.locator('text=' + u.dashboardText)).toBeVisible({ timeout: 5000 })
})

test('patient signs in and sees patient dashboard', async ({ page }) => {
  const u = USERS.patient
  await page.fill('#email', u.email)
  await page.fill('#password', u.password)
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/patient/dashboard')
  await expect(page.locator('text=' + u.dashboardText)).toBeVisible({ timeout: 5000 })
})
