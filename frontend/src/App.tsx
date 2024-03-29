import { Alert, Box, Collapse, Container, CssBaseline, IconButton } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import AppToolbar from './components/UI/AppToolbar/AppToolbar';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Register from './features/users/Register';
import Login from './features/users/Login';
import Cocktails from './features/Cocktails/Cocktails';
import CocktailForm from './features/Cocktails/components/CocktailForm';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import { closeAlert, selectStatusOfAlert } from './features/Cocktails/cocktailsSlice';
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const user = useAppSelector(selectUser);
  const alert = useAppSelector(selectStatusOfAlert);
  const dispatch = useAppDispatch();

  return (
    <>
      <CssBaseline/>
      <header>
        <AppToolbar/>
      </header>
      <main>
        <Container maxWidth="xl">
          <Box sx={{width: '100%'}}>
            <Collapse in={alert}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      dispatch(closeAlert());
                    }}
                  >
                    <CloseIcon fontSize="inherit"/>
                  </IconButton>
                }
                sx={{mb: 2}}
              >
                Ваш коктейль находится на рассмотрении модератора.
              </Alert>
            </Collapse>
          </Box>
          <Routes>
            <Route path="/" element={<Cocktails/>} />
            <Route path="/cocktails/new" element={(<CocktailForm />
              // <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              //   <CocktailForm />
              // </ProtectedRoute>
            )} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </Container>
      </main>
    </>
  )
}

export default App
