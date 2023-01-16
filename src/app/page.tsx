"use client";
import Input from "@/components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { formSchema } from "../components/formSchema";
import { useEffect, useState } from "react";
import { dateFormatter, dateToDayName } from "@/components/dateFormatter";
import moment from "moment";

// const inter = Inter({ subsets: ['latin'] })

const EVEN_PLATES = [1, 2, 3, 4, 5];
const ODD_PLATES = [6, 7, 8, 9, 0];

function getWorkingDays(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = startDate;
  while (currentDate <= endDate) {
    const weekDay = currentDate.getDay();
    if (weekDay != 0 && weekDay != 6) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

const getRestrictionDates = (isEven: boolean, weekDates: any) => {
  const days = weekDates
    .filter((date: any) => {
      const day = date.toISOString().slice(0, 10).replace(/-/g, "").slice(6, 8);
      if (isEven) {
        return Number(day) % 2 === 0;
      }
      return Number(day) % 2 !== 0;
    })
    .map((date: any) => dateToDayName(date));

  return days;
};

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [restrictionDays, setRestrictionDays] = useState<any>([]);

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
    const startOfWeek = new Date();
    const endOfWeek = moment().endOf("week").toDate();
    const weekDates = getWorkingDays(startOfWeek, endOfWeek);
    const lastDigit = plate[plate.length - 1];
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const day = date.slice(6, 8);
    const isDateEven = Number(day) % 2 === 0;
    const isPlateEven = EVEN_PLATES.includes(Number(lastDigit));
    const restrictionDays = getRestrictionDates(isPlateEven, weekDates);
    if (isDateEven) {
      setResult(EVEN_PLATES.includes(Number(lastDigit)));
    } else {
      setResult(ODD_PLATES.includes(Number(lastDigit)));
    }
    setRestrictionDays(restrictionDays);
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
    <main className="mx-auto sm:px-6 lg:px-8 flex justify-center h-screen pb-32">
      <div className="flex flex-col justify-center items-center">
        <p className="text-center font-bold text-2xl capitalize">
          {dateFormatter(new Date())}
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
        {result !== null && (
          <>
            <h2 className="text-center font-bold text-6xl uppercase">
              {result ? "Si" : "No"}
            </h2>

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
