import * as React from "react";
import { Unstable_NumberInput as BaseNumberInput, numberInputClasses } from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";


const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {

    return (
        <BaseNumberInput  {...props}  ref={ref} max={8} min={8}  />
    );
});


export default NumberInput;
