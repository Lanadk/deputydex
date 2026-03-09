"use client";

import React, { useMemo } from "react";
import { ThemeProvider, createTheme, StyledEngineProvider } from "@mui/material/styles";
import type {} from "@mui/x-charts/themeAugmentation";

type Props = {
    children: React.ReactNode;
};

export function MuiProvider({ children }: Props) {
    const theme = useMemo(() => {
        return createTheme({
            typography: {
                fontFamily: "Arial, Helvetica, sans-serif",
            },
        });
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledEngineProvider>
    );
}