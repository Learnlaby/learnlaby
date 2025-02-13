interface LineChartData {
  month: string
  assignment: number
  quiz: number
}

interface BarChartData {
  name: string
  value: number
}

interface LineChartProps {
  data: LineChartData[]
  categories: string[]
  index: string
  colors: string[]
  valueFormatter: (value: number) => string
  className?: string
}

interface BarChartProps {
  data: BarChartData[]
  categories: string[]
  index: string
  colors: string[]
  valueFormatter: (value: number) => string
  className?: string
}

export const LineChart = ({ data, categories, index, colors, valueFormatter, className }: LineChartProps) => {
  //Implementation for LineChart using data, categories, index, colors, valueFormatter, className
  return <div className={className}>LineChart</div>
}

export const BarChart = ({ data, categories, index, colors, valueFormatter, className }: BarChartProps) => {
  //Implementation for BarChart using data, categories, index, colors, valueFormatter, className
  return <div className={className}>BarChart</div>
}

