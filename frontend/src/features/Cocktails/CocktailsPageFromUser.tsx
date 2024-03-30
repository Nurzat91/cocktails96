import {useEffect} from 'react';
import {CircularProgress, Container, Grid, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectStateOfCocktails, selectStatusOfCocktails} from "./cocktailsSlice";
import {getCocktailsByAuthor} from "./cocktailsThunks";
import CocktailCard from "./components/CocktailCard";
import {selectUser} from "../users/usersSlice";


const CocktailsPageFromUser = () => {
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectStateOfCocktails);
  const loading = useAppSelector(selectStatusOfCocktails);
  const user = useAppSelector(selectUser)!;

  useEffect(() => {
    dispatch(getCocktailsByAuthor(user._id));
  }, [user._id]);

  return (
    <Container fixed>
      {cocktail.length ? <>
          <Typography textAlign="center" variant="h2">
            My Cocktails:
          </Typography>
          <Grid container gap={2}>
            {loading ? <CircularProgress/> : cocktail.map((el) => <CocktailCard key={Math.random()}
             cocktail={el}/>)}
          </Grid>
        </> :
        <Typography textAlign="center" variant="h2">There is no cocktails yet</Typography>
      }
    </Container>
  );
};

export default CocktailsPageFromUser;