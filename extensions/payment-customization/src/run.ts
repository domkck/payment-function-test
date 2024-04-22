import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  console.log('Running');
  const hasPdSellingPlanWithCheckoutCharge = input.cart.lines.some((line) => line.sellingPlanAllocation?.sellingPlan?.metafield?.value === "true");
  const pdPaymentMethod = input.paymentMethods.find(method => method.name.includes('(COD)'));
  const otherPaymentMethods = input.paymentMethods.filter(method => !method.name.includes('(COD)'));

  console.log(JSON.stringify(input.cart.lines))
  console.log(hasPdSellingPlanWithCheckoutCharge);
  console.log(JSON.stringify(pdPaymentMethod));
  console.log(JSON.stringify(otherPaymentMethods));

  if (!pdPaymentMethod) {
    return NO_CHANGES;
  }

  if (hasPdSellingPlanWithCheckoutCharge) {
    return {
      operations: otherPaymentMethods.map(method => ({
        hide: {
          paymentMethodId: method.id
        }
      }))
    };
  }

  return {
    operations: [{
      hide: {
        paymentMethodId: pdPaymentMethod.id
      }
    }]
  };
};
