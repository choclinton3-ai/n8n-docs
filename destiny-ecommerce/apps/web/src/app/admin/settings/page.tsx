'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Save, Globe, Bell, CreditCard, Truck, Shield } from 'lucide-react'

interface Settings {
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  timezone: string
  minOrderAmount: number
  freeShippingThreshold: number
  defaultShippingFee: number
  mtnMomoEnabled: boolean
  orangeMoneyEnabled: boolean
  cashOnDeliveryEnabled: boolean
  emailNotificationsEnabled: boolean
  smsNotificationsEnabled: boolean
  maintenanceMode: boolean
}

const defaultSettings: Settings = {
  storeName: 'Destiny E-Commerce',
  storeEmail: 'hello@destiny-ecommerce.com',
  storePhone: '+237 653 526 767',
  storeAddress: 'Cameroon',
  currency: 'FCFA',
  timezone: 'Africa/Douala',
  minOrderAmount: 1000,
  freeShippingThreshold: 50000,
  defaultShippingFee: 2000,
  mtnMomoEnabled: true,
  orangeMoneyEnabled: true,
  cashOnDeliveryEnabled: false,
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  maintenanceMode: false,
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 bg-destiny-50 rounded-xl flex items-center justify-center">
          <Icon size={17} className="text-destiny-pink" />
        </div>
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-destiny-pink' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

export default function AdminSettingsPage() {
  const { token } = useAuthStore()
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (token) load() }, [token])

  async function load() {
    try {
      const res = await api.get<Settings>('/admin/settings', token!)
      setSettings({ ...defaultSettings, ...res })
    } catch { /* use defaults */ }
    finally { setLoading(false) }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', settings, token!)
      toast.success('Settings saved!')
    } catch (err: any) { toast.error(err.message || 'Failed to save settings') }
    finally { setSaving(false) }
  }

  const set = (key: keyof Settings, value: any) => setSettings(p => ({ ...p, [key]: value }))

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading settings...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black font-display">Platform Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-destiny text-sm px-5 py-2 flex items-center gap-2">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="p-6 max-w-4xl space-y-6">
        <Section icon={Globe} title="Store Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Store Name"><input value={settings.storeName} onChange={e => set('storeName', e.target.value)} className="input-destiny" /></Field>
            <Field label="Store Email"><input type="email" value={settings.storeEmail} onChange={e => set('storeEmail', e.target.value)} className="input-destiny" /></Field>
            <Field label="Store Phone"><input value={settings.storePhone} onChange={e => set('storePhone', e.target.value)} className="input-destiny" /></Field>
            <Field label="Timezone">
              <select value={settings.timezone} onChange={e => set('timezone', e.target.value)} className="input-destiny">
                <option value="Africa/Douala">Africa/Douala (WAT)</option>
                <option value="UTC">UTC</option>
              </select>
            </Field>
            <Field label="Store Address" ><input value={settings.storeAddress} onChange={e => set('storeAddress', e.target.value)} className="input-destiny" /></Field>
          </div>
        </Section>

        <Section icon={Truck} title="Shipping & Orders">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Min Order Amount (FCFA)"><input type="number" value={settings.minOrderAmount} onChange={e => set('minOrderAmount', Number(e.target.value))} className="input-destiny" /></Field>
            <Field label="Default Shipping Fee (FCFA)"><input type="number" value={settings.defaultShippingFee} onChange={e => set('defaultShippingFee', Number(e.target.value))} className="input-destiny" /></Field>
            <Field label="Free Shipping Threshold (FCFA)"><input type="number" value={settings.freeShippingThreshold} onChange={e => set('freeShippingThreshold', Number(e.target.value))} className="input-destiny" /></Field>
          </div>
        </Section>

        <Section icon={CreditCard} title="Payment Methods">
          <Toggle label="MTN Mobile Money" description="653526767 — *126*4*1*653526767*AMOUNT#" checked={settings.mtnMomoEnabled} onChange={v => set('mtnMomoEnabled', v)} />
          <Toggle label="Orange Money" description="640638536 — Cho Clinton Teneng" checked={settings.orangeMoneyEnabled} onChange={v => set('orangeMoneyEnabled', v)} />
          <Toggle label="Cash on Delivery" description="Enable pay-at-door option" checked={settings.cashOnDeliveryEnabled} onChange={v => set('cashOnDeliveryEnabled', v)} />
        </Section>

        <Section icon={Bell} title="Notifications">
          <Toggle label="Email Notifications" description="Order confirmations, shipping updates" checked={settings.emailNotificationsEnabled} onChange={v => set('emailNotificationsEnabled', v)} />
          <Toggle label="SMS Notifications" description="Requires Africa's Talking API key" checked={settings.smsNotificationsEnabled} onChange={v => set('smsNotificationsEnabled', v)} />
        </Section>

        <Section icon={Shield} title="Security & Maintenance">
          <Toggle label="Maintenance Mode" description="Temporarily disable the storefront for customers" checked={settings.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
          {settings.maintenanceMode && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
              ⚠️ Maintenance mode is ON — customers cannot access the store
            </div>
          )}
        </Section>

        <div className="pb-8">
          <button type="submit" disabled={saving} className="btn-destiny px-8 flex items-center gap-2">
            <Save size={16} /> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
