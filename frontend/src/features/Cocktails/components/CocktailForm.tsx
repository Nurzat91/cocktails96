import React, {useState} from 'react';
import { Box, Button, Card, Grid, IconButton, TextField, Typography } from '@mui/material';
import FileInput from '../../../components/UI/FileInput/FileInput';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {useNavigate} from 'react-router-dom';
import {LoadingButton} from '@mui/lab';
import {selectStatusOfPostingCocktails} from "../cocktailsSlice";
import {CocktailMutation} from "../../../types";
import {createCocktails} from "../cocktailsThunks";
import CloseIcon from "@mui/icons-material/Close";

const CocktailForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectStatusOfPostingCocktails);
  const onSubmit = async (CocktailMutation: CocktailMutation) => {
    try {
      await dispatch(createCocktails(CocktailMutation)).unwrap();
      navigate('/');
    } catch (e) {
      throw new Error();
    }
  };

  const [state, setState] = useState<CocktailMutation>({
    name: '',
    receipt: '',
    image: null,
    ingredients: [
      {
        name: '',
        amount: ''
      }
    ]
  });

  const submitFormHandler = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmit(state);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setState((prevState) => {
      return {...prevState, [name]: value};
    });
  };

  const inputIngredientChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const {name, value} = e.target;
    setState((prevState) => {
      const updated = [...prevState.ingredients];
      updated[index] = {...updated[index], [name]: value};
      return {...prevState, ingredients: updated};
    });
  };

  const deleteInput = (index: number) => {
    setState((prevState) => {
      const updated = [...prevState.ingredients];
      updated.splice(index, 1);
      return {...prevState, ingredients: updated};
    })
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  const addNewField = () => {
    setState((prevState) => {
      const updated = [...prevState.ingredients];
      updated.push({name: '', amount: ''});
      return {...prevState, ingredients: updated};
    })
  }

  return (
   <>
     <Card variant="outlined">
       <Typography variant="h4">Add new cocktail: </Typography>
       <form autoComplete="off" onSubmit={submitFormHandler}>
         <Grid container direction="row" spacing={2} sx={{marginY: '15px'}}>
           <Grid container item alignItems="center" xs={12}>
             <Grid item sx={{ paddingLeft: '20px', width: '20%' }}>
               <Typography variant="h6">Name</Typography>
             </Grid>
             <TextField
               sx={{margin: '20px', width: '70%'}}
               label="Cocktail"
               name="name"
               value={state.name}
               onChange={inputChangeHandler}
               required
             />
           </Grid>

           <Grid container item alignItems="center" xs={12}>
             <Grid item sx={{ paddingLeft: '20px', width: '20%' }}>
               <Typography variant="h6">Ingredients</Typography>
             </Grid>
             <Grid width='60%'>
               {state.ingredients.map((_ingredient, index) =>
                 <Box key={index} width='100%' margin='20px' marginBottom={2}>
                   <TextField
                     sx={{width: '75%'}}
                     label="Ingredient"
                     name="name"
                     value={state.ingredients[index].name}
                     onChange={(e) => inputIngredientChangeHandler(e, index)}
                     required
                   />
                   <TextField
                     sx={{width: '15%', marginLeft: '2%'}}
                     label="Amount"
                     name="amount"
                     value={state.ingredients[index].amount}
                     onChange={(e) => inputIngredientChangeHandler(e, index)}
                     required
                   />
                   {index !== 0 && <IconButton
                     aria-label="Close"
                     color="inherit"
                     size="small"
                     onClick={() => deleteInput(index)}
                   >
                     <CloseIcon fontSize='small'/>
                   </IconButton>}
                 </Box>
               )}
             </Grid>
           </Grid>
           <Grid container item xs={11} justifyContent="flex-end">
             <Button variant='outlined' type='button' onClick={addNewField}>
               Add New Ingredient
             </Button>
           </Grid>
           <Grid container item alignItems="center" xs={12}>
             <Grid item sx={{ paddingLeft: '20px', width: '20%' }}>
               <Typography variant="h6">Recipe</Typography>
             </Grid>
             <TextField
               sx={{margin: '20px', width: '70%'}}
               multiline
               rows={3}
               id="info"
               label="Information about cocktail"
               value={state.receipt}
               onChange={inputChangeHandler}
               name="receipt"
             />
           </Grid>

           <Grid container item xs={12} >
             <Grid item sx={{ paddingLeft: '20px', width: '20%' }}>
               <Typography variant="h6">Image</Typography>
             </Grid>
             <Grid item xs={6} sx={{margin: '20px', width: '70%'}}>
               <FileInput label="Image" onChange={fileInputChangeHandler} name="image"/>
             </Grid>
           </Grid>

           <Grid container item xs={12}>
             <LoadingButton sx={{margin: '20px'}} loading={loading} type="submit" color="primary" variant="contained">
               Create cocktail
             </LoadingButton>
           </Grid>
         </Grid>
       </form>
     </Card>
   </>
  );
};
export default CocktailForm;