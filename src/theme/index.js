import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

function Theme(props) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    type: /*prefersDarkMode*/true ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return <ThemeProvider theme={theme}><CssBaseline />{props.children}</ThemeProvider>;
}

export default Theme;