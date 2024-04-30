import { render, screen } from '@testing-library/react';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App';

function FinalComponentTree(props){
  return(
    <StyledEngineProvider injectFirst>
      <App/>
    </StyledEngineProvider>
  );
}
