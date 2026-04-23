const GRADIENT = "linear-gradient(135deg, #12C9F9 0%, #0CAFFE 50%, #0678FF 100%)";

export default function GradientSquare({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        background: GRADIENT,
        flexShrink: 0,
        borderRadius: 0,
      }}
    />
  );
}
