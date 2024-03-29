import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Cocktail from "./models/Cocktails";

const dropCollection = async (db: mongoose.Connection, collectionName: string) =>{
  try {
    await db.dropCollection(collectionName);
  }catch (e){
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};
const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  const collections = ['users', 'cocktails'];

  for (const collectionName of collections){
    await dropCollection(db, collectionName);
  }
  const [user1, user2] = await User.create(
    {
      email: "admin@gmail.com",
      password: "admin",
      displayName: "admin",
      avatar: "images/admin.jpg",
      role: "admin",
      token: "admin",
    },
    {
      email: "user@gmail.com",
      password: "user",
      displayName: "user",
      avatar: "images/user.png",
      role: "user",
      token: "user",
    }
  );

  await Cocktail.create(
    {
      name: "Margarita",
      receipt: "Fill a cocktail shaker with ice, then add the tequila, lime juice and triple sec. Shake until the outside of the shaker feels cold.",
      author: user1._id,
      isPublished: true,
      image: "fixtures/Margarita.jpeg",
      ingredients: [
        {name: "tequila reposado", amount: "50ml"},
        {name: "lime juice", amount: "25ml"},
        {name: "triple sec", amount: "20ml"}
      ],
    },
    {
      name: "Dry Martini",
      receipt: "A James Bond favorite, the Dry Martini is simple and elegant. While we don't know the exact origin of the " +
        "Dry Martini, we do know that the cocktail made with dry gin, dry vermouth, and orange bitters is best served with a lemon twist.",
      author: user1._id,
      isPublished: true,
      image: "fixtures/DryMartini.jpeg",
      ingredients: [
        {name: "vodka", amount: "100ml"},
        {name: "Martini", amount: "50ml"},
      ],
    },
    {
      name: "Whiskey Sour",
      receipt: "The first printed recipe for a Whiskey Sour appeared in the \"Jerry Thomas Bartenders Guide,\" which was the first-ever cocktail book released in 1862. " +
        "A mixture of whiskey, sugar, and lemon, the Whiskey Sour used to be made with egg white, but that ingredient isn't as common anymore.",
      author: user2._id,
      isPublished: true,
      image: "fixtures/WhiskeySour.jpg",
      ingredients: [
        {name: "whiskey", amount: "50ml"},
        {name: "maraschino cherries for garnish", amount: "3ml"},
        {name: "fluid ounces fresh lemon juice", amount: "2ml"},
      ],
    },
    {
      name: "Pink negroni",
      receipt: "Combine the pink gin, vermouth and Aperol in a tumbler with a small handful of ice. Stir until the outside of the glass feels cold.",
      author: user2._id,
      image: "fixtures/Pinknegroni.jpg",
      ingredients: [
        {name: "pink gin", amount: "35ml"},
        {name: "sweet white vermouth", amount: "25ml"},
        {name: "Aperol", amount: "15ml"}
      ],
    },
  );
  await db.close();
};

run().catch(console.error);