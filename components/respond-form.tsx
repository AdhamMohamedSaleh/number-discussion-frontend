"use client";

import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CalculationNode, Operation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface RespondFormProps {
  parentNode: CalculationNode;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  operation: Operation;
  operand: string;
}

const OPERATIONS: { value: Operation; label: string; symbol: string }[] = [
  { value: "+", label: "Add", symbol: "+" },
  { value: "-", label: "Subtract", symbol: "-" },
  { value: "*", label: "Multiply", symbol: "×" },
  { value: "/", label: "Divide", symbol: "÷" },
];

const formatValue = (value: number) => {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(4).replace(/\.?0+$/, "");
};

export function RespondForm({
  parentNode,
  onSuccess,
  onCancel,
}: RespondFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      operation: "+",
      operand: "",
    },
  });

  const operation = useWatch({ control, name: "operation" });
  const operand = useWatch({ control, name: "operand" });

  const calculatePreview = () => {
    const num = parseFloat(operand);
    if (isNaN(num)) return null;

    switch (operation) {
      case "+":
        return parentNode.value + num;
      case "-":
        return parentNode.value - num;
      case "*":
        return parentNode.value * num;
      case "/":
        return num === 0 ? null : parentNode.value / num;
    }
  };

  const preview = calculatePreview();

  const onSubmit = async (data: FormData) => {
    const numOperand = parseFloat(data.operand);
    if (isNaN(numOperand)) {
      toast.error("Invalid number");
      return;
    }

    if (data.operation === "/" && numOperand === 0) {
      toast.error("Cannot divide by zero");
      return;
    }

    try {
      await api.respondToCalculation(parentNode.id, {
        operation: data.operation,
        operand: numOperand,
      });
      const result = calculatePreview();
      toast.success("Response added!", {
        description: `${formatValue(parentNode.value)} ${
          OPERATIONS.find((o) => o.value === data.operation)?.symbol
        } ${numOperand} = ${result !== null ? formatValue(result) : "?"}`,
      });
      onSuccess();
    } catch (err) {
      toast.error("Failed to submit response", {
        description: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  return (
    <Card className="border-primary/50 animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <CardHeader>
        <CardTitle className="text-base">
          Respond to {formatValue(parentNode.value)}
        </CardTitle>
        <CardDescription>
          Choose an operation and number to create a new result
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("operation")} />
          <div className="flex gap-2">
            {OPERATIONS.map((op) => (
              <Button
                key={op.value}
                type="button"
                variant={operation === op.value ? "default" : "outline"}
                size="sm"
                onClick={() => setValue("operation", op.value)}
                className="flex-1 cursor-pointer transition-all"
              >
                {op.symbol}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">
              {formatValue(parentNode.value)}
            </span>
            <span className="text-lg text-muted-foreground transition-all">
              {OPERATIONS.find((op) => op.value === operation)?.symbol}
            </span>
            <Input
              type="number"
              placeholder="Number"
              step="any"
              className="flex-1"
              {...register("operand", {
                required: "Please enter a number",
              })}
            />
            {preview !== null && (
              <>
                <span className="text-lg text-muted-foreground">=</span>
                <span className="text-lg font-bold text-primary animate-in fade-in-0 duration-200">
                  {formatValue(preview)}
                </span>
              </>
            )}
          </div>
          {errors.operand && (
            <p className="text-sm text-destructive">{errors.operand.message}</p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
