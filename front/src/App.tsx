import './App.scss';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import Results from './components/Results';
import Query from './components/Query';
import { ResultItem } from './types/ResultItem';
import { QueryParamsFull } from './types/QueryParams';
import { Api } from './services/Api';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [results, setResults] = useState<ResultItem[]>([])

  async function fetchResults (query: QueryParamsFull): Promise<void> {
    setResults(await Api.fetchFilteredResults(query))
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="App">
        <Container maxWidth="lg">
          <Query onQueryChange={fetchResults} />
          <Results results={results} />
        </Container>
      </main>
    </ThemeProvider>
  );
}

export default App;
