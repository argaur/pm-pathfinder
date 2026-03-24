'use client'

import { useState } from 'react'
import { X, Check, Zap } from 'lucide-react'

interface PricingModalProps {
  onClose: () => void
}

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹799',
    period: '/month',
    subtext: 'Billed monthly',
    badge: null,
    highlight: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '₹5,999',
    period: '/year',
    subtext: '₹500/month — save 37%',
    badge: 'Most Popular',
    highlight: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '₹16,999',
    period: 'one-time',
    subtext: 'Pay once, use forever',
    badge: 'Best Value',
    highlight: false,
  },
]

const FREE_FEATURES = [
  'PM Archetype Assessment',
  'Archetype reveal & basic report',
  'Dashboard overview',
  'Learning Path — Chapter 1 only',
]

const PRO_FEATURES = [
  'Full Report with deep dimension insights',
  'Complete Learning Path — all 5 chapters',
  'Deep Dive sub-category analysis',
  'Interview Readiness score + full breakdown',
  'Portfolio builder + shareable public link',
  'Unlimited re-evaluations',
  'Priority support',
]

export default function PricingModal({ onClose }: PricingModalProps) {
  const [selected, setSelected] = useState('annual')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0f1729] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-[#dae2fd]">Upgrade to Pro</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#918fa1] hover:text-[#c7c4d8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Plan selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative flex flex-col items-center p-4 rounded-xl border transition-all text-center ${
                  selected === plan.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/[0.08] bg-[#171f33] hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500 text-white whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <p className="text-xs text-[#918fa1] mb-1">{plan.name}</p>
                <p className="text-xl font-bold text-[#dae2fd]">{plan.price}</p>
                <p className="text-xs text-[#918fa1] mt-0.5">{plan.period}</p>
                <p className="text-[10px] text-indigo-400 mt-1">{plan.subtext}</p>
              </button>
            ))}
          </div>

          {/* Features comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Free */}
            <div className="bg-[#171f33] rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-[#918fa1] font-medium mb-3">Free</p>
              <ul className="flex flex-col gap-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#918fa1] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-[#918fa1]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-indigo-500/[0.07] border border-indigo-500/20 rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">Pro — everything +</p>
              <ul className="flex flex-col gap-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-[#c7c4d8]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-[0_0_24px_rgba(99,102,241,0.25)]"
            onClick={() => {
              // Payment integration goes here
              onClose()
            }}
          >
            Get Pro — {PLANS.find((p) => p.id === selected)?.price}
            {selected !== 'lifetime' && PLANS.find((p) => p.id === selected)?.period}
          </button>

          <p className="text-center text-[11px] text-[#918fa1] mt-3">
            Secure payment · Cancel anytime (monthly/annual) · No hidden fees
          </p>
        </div>
      </div>
    </div>
  )
}
