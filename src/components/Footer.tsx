import Link from "next/link";

type Props = {};

export default function Footer({}: Props) {
  return (
    <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
      <p className="text-gray-500 text-sm font-mono">
        Creado con <span className="text-xs">🤍</span> por
      </p>
      <div className="font-bold text-gray-300 text-xs font-mono text-center mt-2">
        <Link href="https://twitter.com/micael_sosa">michaelsosa</Link>
      </div>
    </div>
  );
}
