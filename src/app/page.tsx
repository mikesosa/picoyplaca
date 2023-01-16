"use client";
import Input from "@/components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formSchema } from "../components/formSchema";
import { useEffect, useState } from "react";

// const inter = Inter({ subsets: ['latin'] })

const EVEN_PLATES = [1, 2, 3, 4, 5];
const ODD_PLATES = [6, 7, 8, 9, 0];

export default function Home() {
  const [result, setResult] = useState<any>(null);

  const {
    register,
    reset,
    watch: watchForm,
    handleSubmit: handleSubmitForm,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const checkPicoPlaca = (plate: string) => {
    const lastDigit = plate[plate.length - 1];
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const day = date.slice(6, 8);
    const isDateEven = Number(day) % 2 === 0;
    if (isDateEven) {
      setResult(EVEN_PLATES.includes(Number(lastDigit)));
    }
    setResult(ODD_PLATES.includes(Number(lastDigit)));
  };

  useEffect(() => {
    const subscription = watchForm((value, { name, type }) => {
      if (name === "number") {
        if (value.number.length === 3) {
          checkPicoPlaca(value.number);
        } else {
          setResult(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watchForm]);

  return (
    <main className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-column justify-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-center font-bold text-2xl uppercase">
          ¿Tengo pico y placa hoy?
        </h2>

        <div className="py-8 w-2/4 sm:w-2/5">
          <Input
            type="number"
            label="Ingresa los 3 digitos de tu placa"
            className="p-2 mt-4 text-center text-5xl w-full text-black bg-[#F7C001] rounded-lg border-4 border-[black] focus:outline-none focus:ring-4 focus:ring-[black]focus:border-transparent"
            errors={errors}
            {...register("number")}
          />
        </div>
        <h2 className="text-center font-bold text-6xl uppercase">
          {result === null ? "" : result ? "Si" : "No"}
        </h2>
      </div>
    </main>
  );
}
