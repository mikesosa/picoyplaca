"use client";
import Input from "@/components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formSchema } from "../components/formSchema";
import { useEffect, useMemo, useState } from "react";
import { dateFormatter, dateToDayName } from "@/components/dateFormatter";
import moment from "moment";

// Tipos
type City = "Bogotá" | "Pereira";

// Constantes para Bogotá (lógica par/impar)
const EVEN_PLATES = [1, 2, 3, 4, 5];
const ODD_PLATES = [6, 7, 8, 9, 0];

// Reglas de Pereira: día de la semana -> dígitos restringidos
// 1 = Lunes, 2 = Martes, ..., 5 = Viernes
const PEREIRA_RULES: Record<number, number[]> = {
  1: [0, 1], // Lunes
  2: [2, 3], // Martes
  3: [4, 5], // Miércoles
  4: [6, 7], // Jueves
  5: [8, 9], // Viernes
};

const CITIES: City[] = ["Bogotá", "Pereira"];

function getWorkingDays(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const weekDay = currentDate.getDay();
    if (weekDay !== 0 && weekDay !== 6) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

// Función para obtener días de restricción según la ciudad
const getRestrictionDates = (
  city: City,
  lastDigit: number,
  weekDates: Date[]
): string[] => {
  if (city === "Bogotá") {
    const isPlateEven = EVEN_PLATES.includes(lastDigit);
    const days = weekDates
      .filter((date: Date) => {
        const day = date.toISOString().slice(0, 10).replace(/-/g, "").slice(6, 8);
        if (isPlateEven) {
          return Number(day) % 2 === 0;
        }
        return Number(day) % 2 !== 0;
      })
      .map((date: Date) => dateToDayName(date));
    return days;
  } else {
    // Pereira: buscar en qué día de la semana está restringido este dígito
    const days = weekDates
      .filter((date: Date) => {
        const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, ...
        const restrictedDigits = PEREIRA_RULES[dayOfWeek];
        return restrictedDigits?.includes(lastDigit);
      })
      .map((date: Date) => dateToDayName(date));
    return days;
  }
};

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const [city, setCity] = useState<City>("Bogotá");
  const [result, setResult] = useState<boolean | null>(null);
  const [restrictionDays, setRestrictionDays] = useState<string[]>([]);
  const [isWeekend, setIsWeekend] = useState<boolean>(false);

  const {
    register,
    reset,
    watch: watchForm,
    handleSubmit: handleSubmitForm,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const checkPicoPlaca = (plate: string, date: Date, selectedCity: City) => {
    const startOfWeek = moment(new Date(date)).startOf("week").toDate();
    const endOfWeek = moment(new Date(date)).endOf("week").toDate();
    const weekDates = getWorkingDays(startOfWeek, endOfWeek);
    const lastDigit = Number(plate[plate.length - 1]);
    const isWeekendDay =
      new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

    // Calcular días de restricción de la semana
    const calculatedRestrictionDays = getRestrictionDates(
      selectedCity,
      lastDigit,
      weekDates
    );

    if (selectedCity === "Bogotá") {
      // Lógica de Bogotá: par/impar del día del mes
      const day = moment(date).format("DD");
      const isDateEven = Number(day) % 2 === 0;
      if (isDateEven) {
        setResult(EVEN_PLATES.includes(lastDigit));
      } else {
        setResult(ODD_PLATES.includes(lastDigit));
      }
    } else {
      // Lógica de Pereira: día de la semana
      if (isWeekendDay) {
        setResult(false); // No aplica en fin de semana
      } else {
        const dayOfWeek = new Date(date).getDay();
        const restrictedDigits = PEREIRA_RULES[dayOfWeek] || [];
        setResult(restrictedDigits.includes(lastDigit));
      }
    }

    setIsWeekend(isWeekendDay);
    setRestrictionDays(calculatedRestrictionDays);
  };

  // Efecto para recalcular cuando el usuario escribe
  useEffect(() => {
    const subscription = watchForm((value, { name, type }) => {
      if (name === "number") {
        if (value.number && value.number.length === 3) {
          checkPicoPlaca(value.number, today, city);
        } else {
          setResult(null);
          setIsWeekend(false);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watchForm, today, city]);

  // Efecto para recalcular cuando cambia la ciudad
  useEffect(() => {
    const currentValue = watchForm("number");
    if (currentValue && currentValue.length === 3) {
      checkPicoPlaca(currentValue, today, city);
    }
  }, [city]);

  return (
    <main className="mx-auto sm:px-6 lg:px-8 flex justify-center h-screen pb-32">
      <div className="flex flex-col justify-center items-center">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value as City)}
          className="text-center font-bold text-3xl uppercase bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg px-2 py-1 hover:bg-white/10 transition-colors"
        >
          {CITIES.map((c) => (
            <option key={c} value={c} className="bg-black text-white">
              {c === "Bogotá" ? "BOGOTÁ D.C" : "PEREIRA"}
            </option>
          ))}
        </select>

        <p className="text-center font-bold text-2xl capitalize">
          {dateFormatter(new Date(today))}
        </p>
        <div className="mt-4 mb-8 w-2/4 sm:w-2/5">
          <Input
            type="number"
            label="Ingresa los 3 digitos de tu placa"
            className="appearance-none p-2 mt-4 text-center text-5xl w-full text-black bg-[#F7C001] rounded-lg border-4 border-[black] focus:outline-none focus:ring-4 focus:ring-[black]focus:border-transparent"
            errors={errors}
            {...register("number")}
          />
        </div>
        <h3 className="text-center font-bold text-2xl uppercase">
          ¿Tengo pico y placa hoy?
        </h3>
        {isWeekend && (
          <h2 className="text-center font-bold text-6xl uppercase">
            NO APLICA
          </h2>
        )}

        {result !== null && (
          <>
            {!isWeekend && (
              <h2 className="text-center font-bold text-6xl uppercase">
                {result ? "Si" : "No"}
              </h2>
            )}

            <p className="text-center text-md mt-3">
              Esta semana tienes pico y placa los dias:
            </p>
            <span className="font-bold capitalize">
              {restrictionDays.join(", ")}
            </span>
          </>
        )}
      </div>
    </main>
  );
}
