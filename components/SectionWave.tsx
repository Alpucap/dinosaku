type SectionWaveProps = {
  above: string;
  below: string;
  variant?: "a" | "b";
};

const paths = {
  a: "M0,64 C240,16 420,96 720,72 C1020,48 1200,8 1440,40 L1440,120 L0,120 Z",
  b: "M0,40 C180,88 360,8 660,32 C960,56 1140,104 1440,64 L1440,120 L0,120 Z",
};

export default function SectionWave({ above, below, variant = "a" }: SectionWaveProps) {
  return (
    <div className={`${above} leading-[0]`} aria-hidden>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-14 w-full md:h-24"
      >
        <path d={paths[variant]} fill={below} />
      </svg>
    </div>
  );
}
