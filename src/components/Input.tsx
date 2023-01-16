import React from "react";
import { classNames } from "./classNames";
import { PatternFormat } from "react-number-format";

interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  errors?: any;
  name: string;
  label?: string;
  className?: string;
  type?:
    | "text"
    | "number"
    | "password"
    | "email"
    | "tel"
    | "textarea"
    | "checkbox"
    | "file";
}

const Input = React.forwardRef(
  (props: IInputProps, ref: React.Ref<HTMLInputElement>) => {
    const errorMessage = props.errors?.[props.name]?.message;
    const isCheckBox = props.type === "checkbox";

    return (
      <div className={`${isCheckBox ? "flex items-center" : ""}`}>
        {props.label && !isCheckBox && (
          <label
            htmlFor={props.name}
            className="block text-sm font-base text-primary-600 text-center"
          >
            {props.label}
          </label>
        )}

        {props.type === "textarea" ? (
          <textarea
            ref={ref as any}
            onChange={(e: any) => {
              if (props.onChange) {
                return props?.onChange(
                  isCheckBox ? e.target.checked : (e.target.value as any)
                );
              }
            }}
            {...props}
            className={classNames(
              isCheckBox ? "p-2" : "px-4 py-3",
              props.type === "textarea" ? "rounded-2xl" : "",
              props.disabled
                ? " bg-gray-100 border border-gray-300"
                : "bg-white border border-gray-300",
              "block w-full mt-1 border-gray-300 rounded-full shadow-sm focus:ring-primary-600 focus:border-primary-600 sm:text-sm",
              props.className
            )}
          />
        ) : props.type === "number" ? (
          <PatternFormat
            getInputRef={ref}
            style={{ boxShadow: "rgb(247 192 0) 0px 0px 0px 0.1em" }}
            className={props.className}
            placeholder={props.placeholder}
            format="###"
            pattern="[0-9]*"
            inputMode="numeric"
            onValueChange={({ value }: any) => {
              const newEvent: any = {
                target: {
                  name: props.name,
                  value: value,
                },
              };

              if (props.onChange) {
                props.onChange(newEvent);
              }
            }}
          />
        ) : (
          <input
            id={props.name}
            ref={ref}
            onChange={(e) => {
              if (props.onChange) {
                return props?.onChange(
                  isCheckBox ? e.target.checked : (e.target.value as any)
                );
              }
            }}
            {...props}
            className={classNames(
              isCheckBox ? "p-2 rounded-sm" : "px-4 py-3",
              props.disabled && isCheckBox ? " bg-gray-100" : "",
              props.disabled && !isCheckBox
                ? "bg-transparent border-0 border-b-2 border-gray-300 text-gray-400"
                : "bg-white border rounded-3xl shadow-sm border-gray-300",
              props.className,
              "appearance-none block w-full sm:text-sm",
              "focus:outline-none focus:ring-primary-600 focus:border-primary-600"
            )}
          />
        )}
        {errorMessage && !isCheckBox && (
          <label className="error text-red-500 ml-4 text-xs">
            {errorMessage}
          </label>
        )}

        {props.label && isCheckBox && (
          <label
            htmlFor={props.name}
            className={`absolute ml-7 text-sm font-medium ${
              errorMessage ? "text-red-500" : "text-gray-700"
            }`}
          >
            {props.label}
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
