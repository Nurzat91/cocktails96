import { useEffect} from 'react';
import {CircularProgress, Container, Grid, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectStateOfCocktails, selectStatusOfCocktails} from "./cocktailsSlice";
import {getCocktails} from "./cocktailsThunks";
import CocktailCard from "./components/CocktailCard";

const Cocktails = () => {
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectStateOfCocktails);
  const loading = useAppSelector(selectStatusOfCocktails);

  useEffect(() => {
    dispatch(getCocktails());
  }, []);

  return (
    <Container fixed>
      {cocktail.length ? <>
          <Typography textAlign="center" variant="h2">
            Cocktails:
          </Typography>
          <Grid container gap={2}>
            {loading ? <CircularProgress/> : cocktail.map((el) => <CocktailCard key={Math.random()}
            cocktail={el}/>)}
          </Grid>
        </> :
        <Typography textAlign="center" variant="h4">Коктейлей пока нет</Typography>
      }
    </Container>
  );
};

export default Cocktails;