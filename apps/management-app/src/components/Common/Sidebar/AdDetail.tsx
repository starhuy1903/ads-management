interface AdDetailProps {
  children?: React.ReactNode;
}

export default function AdDetail({
  children
}: AdDetailProps) {
  return (
    <div>{children}</div>
  )
}
