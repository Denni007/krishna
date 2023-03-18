// routes
import Router from './routes';
// theme
import ThemeProvider from './theme2';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import SnackbarProvider from './components/snackbar';

import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import ThemeLocalization from './components/ThemeLocalization';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ThemeSettings, SettingsProvider } from './components/settings2';

// ----------------------------------------------------------------------

export default function App() {
  return (
    // <ThemeProvider>
    //   <ThemeColorPresets>
    //     <ThemeLocalization>
    //       <RtlLayout>
    //         <NotistackProvider>
    //           <MotionLazyContainer>
    //             <SnackbarProvider />
    //             <ChartStyle />
    //             <SettingsProvider />
    //             <ThemeProvider>
    //               <ScrollToTop />
    //               <Router />
    //             </ThemeProvider>
    //           </MotionLazyContainer>
    //         </NotistackProvider>
    //       </RtlLayout>
    //     </ThemeLocalization>
    //   </ThemeColorPresets>
    // </ThemeProvider>
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <SettingsProvider>

            <ScrollToTop />
            <MotionLazyContainer>
              <ThemeProvider>
                <ThemeLocalization>
                  <SnackbarProvider>
                    <ChartStyle />
                    <Router />
                  </SnackbarProvider>
                </ThemeLocalization>
              </ThemeProvider>
            </MotionLazyContainer>
          </SettingsProvider>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>

  );
}
