type IconProps = { size?: number; className?: string }
const icon = (path: string, { size = 16, className = '' }: IconProps = {}) => (
  <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">
    <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </svg>
)

export const DashboardIcon = (props: IconProps) => icon('M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', props)
export const PipelineIcon = (props: IconProps) => icon('M5 6h14M5 12h14M5 18h14M8 6v12M16 6v12', props)
export const PlanIcon = (props: IconProps) => icon('M6 4h12v16H6zM9 8h6M9 12h6M9 16h4', props)
export const SourcesIcon = (props: IconProps) => icon('M5 4h14v16H5zM8 8h8M8 12h8M8 16h5', props)
export const ExplanationIcon = (props: IconProps) => icon('M12 4a7 7 0 0 0-4 12v3h8v-3a7 7 0 0 0-4-12zM9 22h6', props)
export const MapIcon = (props: IconProps) => icon('M4 6l6-2 4 2 6-2v14l-6 2-4-2-6 2zM10 4v14M14 6v14', props)
export const PracticeIcon = (props: IconProps) => icon('M12 3l8 4v5c0 4-3 7-8 9-5-2-8-5-8-9V7l8-4zM9 12l2 2 4-4', props)
export const MenuIcon = (props: IconProps) => icon('M4 6h16M4 12h16M4 18h16', props)
export const CloseIcon = (props: IconProps) => icon('M6 6l12 12M18 6L6 18', props)
export const AlertIcon = (props: IconProps) => icon('M12 4l9 16H3L12 4zM12 9v5M12 17h.01', props)
export const PlayIcon = (props: IconProps) => icon('M8 5l11 7-11 7V5z', props)
export const SendIcon = (props: IconProps) => icon('M4 4l16 8-16 8 3-8-3-8zM7 12h13', props)
