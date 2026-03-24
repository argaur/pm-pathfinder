'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import PricingModal from './PricingModal'

interface BlurGateProps {
  children: React.ReactNode
  locked?: boolean
  label?: string
  className?: string
}

export default function BlurGate({
  children,
  locked = true,
  label = 'Pro feature',
  className = '',
}: BlurGateProps) {
  const [modalOpen, setModalOpen] = useState(false)

  if (!locked) return <>{children}</>

  return (
    <>
      <div className={`relative rounded-xl overflow-hidden ${className}`}>
        {/* Blurred content */}
        <div className="blur-sm pointer-events-none select-none">
          {children}
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0b1326]/60 cursor-pointer group transition-all hover:bg-[#0b1326]/70"
          onClick={() => setModalOpen(true)}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/30 transition-all">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-[#c7c4d8]">{label}</p>
            <p className="text-[11px] text-indigo-400 group-hover:text-indigo-300 transition-colors">
              Upgrade to unlock
            </p>
          </div>
        </div>
      </div>

      {modalOpen && <PricingModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
