import './App.scss';
import { Alert, Container, createTheme, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import Results from './components/Results';
import Query from './components/Query';
import { ResultItem } from './types/ResultItem';
import { QueryParamsFull } from './types/QueryParams';
import { Api } from './services/Api';
import { Token } from './types/Token';

const darkTheme = createTheme({
  palette: {
    mode: new Date().getHours() > 7 && new Date().getHours() < 21 ? 'light' : 'dark',
  },
});

function App() {
  const [results, setResults] = useState<ResultItem[]>([])
  const [tokens, setTokens] = useState<Token[]>([])
  const [error, setError] = useState<boolean>(false);

  async function fetchResults (query: QueryParamsFull): Promise<void> {
    try {
      setResults(await Api.fetchFilteredResults(query))
      setTokens(await Api.fetchTokens(query.search))
    } catch (e) {
      setError(true);
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="App">
        <Container maxWidth="lg">
          <Query onQueryChange={fetchResults} />
          <Results results={results} tokens={tokens} />
        </Container>
      </main>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom' , horizontal: 'center' }}
        open={error}
        autoHideDuration={10000}
        onClose={(e, reason) => reason !== "clickaway" && setError(false)}
      >
        <Alert onClose={() => setError(false)} severity="error">
          There was a problem while fetching results, please check your query string!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
