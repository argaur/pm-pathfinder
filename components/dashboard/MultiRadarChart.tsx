'use client'

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export interface RadarSeriesPoint {
  dimension: string
  fullMark: number
  [key: string]: string | number
}

export interface RadarSeries {
  key: string
  label: string
  color: string
  fillOpacity: number
  strokeWidth: number
}

interface MultiRadarChartProps {
  data: RadarSeriesPoint[]
  series: RadarSeries[]
  height?: number
}

export default function MultiRadarChart({ data, series, height = 300 }: MultiRadarChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#1e2d45" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-inter)' }}
          />
          {series.map((s) => (
            <Radar
              key={s.key}
              name={s.label}
              dataKey={s.key}
              stroke={s.color}
              fill={s.color}
              fillOpacity={s.fillOpacity}
              strokeWidth={s.strokeWidth}
            />
          ))}
          {series.length > 1 && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '8px' }}
            />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
