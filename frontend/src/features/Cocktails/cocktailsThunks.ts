import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {Cocktail, CocktailMutation} from "../../types";

export const getCocktails = createAsyncThunk<Cocktail[]>('Cocktails/getAll', async () => {
  try {
    const response = await axiosApi.get('/cocktails');
    return response.data;
  } catch (e) {
    return e;
  }
});

export const getCocktailsByAuthor = createAsyncThunk<Cocktail[], string>('Cocktails/getByAuthor', async (id) => {
  try {
    const response = await axiosApi.get('/cocktails?user=' + id);
    return response.data;
  } catch (e) {
    return e;
  }
});

export const getOneCocktail = createAsyncThunk<Cocktail[], string>('Cocktails/getOne', async (id
) => {
  try {
    const response = await axiosApi.get('/cocktails/' + id);
    return response.data;
  } catch (e) {
    return e;
  }
});

export const createCocktails = createAsyncThunk<Cocktail, CocktailMutation>(
  'Cocktails/new',
  async (id) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(id) as (keyof CocktailMutation)[];
      keys.forEach((key) => {
        const value = id[key];
        if (value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      const response = await axiosApi.post('/cocktails', formData);
      return response.data;
    } catch (e) {
      return e;
    }
  });

export const publicCocktails = createAsyncThunk<Cocktail, string>('Cocktails/public', async (id) => {
  try {
    const response = await axiosApi.patch('/cocktails/' + id + '/togglePublished');
    return response.data;
  } catch (e) {
    return e;
  }
});

export const deleteCocktails = createAsyncThunk<Cocktail, string>('Cocktails/delete', async (id) => {
  try {
    const response = await axiosApi.delete('/cocktails/' + id);
    return response.data;
  } catch (e) {
    return e;
  }
});