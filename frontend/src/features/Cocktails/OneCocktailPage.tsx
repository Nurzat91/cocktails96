import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectStateOfCocktails, selectStatusOfCocktails} from "./cocktailsSlice";
import {getOneCocktail} from "./cocktailsThunks";
import {useParams} from "react-router-dom";
import {Box, CircularProgress, Container, Grid, List, ListItem, Typography} from "@mui/material";
import {apiURL} from "../../constants";
import imageNotAvailable from "../../assets/images/image_not_available.png";

const OneCocktailPage = () => {
  const {id} = useParams();
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectStateOfCocktails)[0];
  const loading = useAppSelector(selectStatusOfCocktails);
  let imgUrl;
  if (cocktail) {
    if (cocktail.image) {
      imgUrl = `${apiURL}/${cocktail.image}`;
    } else {
      imgUrl = imageNotAvailable;
    }
  }


  useEffect(() => {
    dispatch(getOneCocktail(id!));
  }, [id]);
  return (
    <Container fixed>
      {loading ? <CircularProgress/> : cocktail &&
        <Grid container>
          <Grid item xs={4}>
            <Box component='img' maxHeight={200} src={imgUrl} alt='cocktail'/>
          </Grid>
          <Grid item xs={8}>
            <Typography variant='h4'>{cocktail.name}</Typography>
            <Typography variant='h5'>Ingredients:</Typography>
            <List>
              {cocktail.ingredients.map(ing => <ListItem key={Math.random()}>
                <Typography>{ing.name} ... {ing.amount}</Typography>
              </ListItem>)}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography marginY="10px" variant='h5'>Receipt</Typography>
            <Typography>{cocktail.receipt}</Typography>
          </Grid>
        </Grid>}
    </Container>
  );
};

export default OneCocktailPage;