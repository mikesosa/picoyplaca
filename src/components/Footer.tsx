import Link from "next/link";
import React from "react";

type Props = {};

export default function Footer({}: Props) {
  return (
    <div className="absolute bottom-0 w-full px-4 pb-2">
      <div className="max-w-lg mx-auto">
        <p className="text-gray-500 text-center text-xs">
          Esta pagina no recolecta datos personales, ni los almacena en ninguna
          base de datos. Es un servicio netamente informativo. Me exonero de
          cualquier responsabilidad por el uso que se le de a esta pagina.
        </p>
        <p className="text-gray-500 text-center text-xs font-mono mt-2">
          Creado con <span className="text-xs">🤍</span> por{" "}
          <Link href="https://twitter.com/micael_sosa">micaelsosa</Link>
        </p>
      </div>
    </div>
  );
}
