import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { useParams } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import { DataContext } from '../context/DataContext';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

const arrTest = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

function RecipeInProgress(props) {
  const { getFetch } = useContext(DataContext);
  const [recipeInfo, setRecipeInfo] = useState({});
  const [foodType, setFoodType] = useState(true);
  const [copy, setCopy] = useState(false);
  const [checked, steChecked] = useState([]);
  const { match: { params: { id }, url } } = props;
  const where = url.split('/')[1];

  useEffect(() => {
    const fetchUrl = where === 'meals'
      ? 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='
      : 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

    const getDataApi = async () => {
      const dataApi = await getFetch(fetchUrl + id);
      setRecipeInfo(dataApi[Object.keys(dataApi)][0]);
      setFoodType(Object.keys(dataApi)[0] === 'meals');
      const dataApitest = dataApi[Object.keys(dataApi)][0];
      const check = () => {
        let arrCheck = [];
        arrTest.forEach((el) => {
          if (dataApitest[`strIngredient${el}`]) {
            const checkList = {
              ingredient: dataApitest[`strIngredient${el}`],
              measure: dataApitest[`strMeasure${el}`],
              checked: false,
            };
            arrCheck = [...arrCheck, checkList];
          }
        });
        steChecked(arrCheck);
      };
      check();
    };
    getDataApi();
  }, []);

  function handleShare() {
    clipboardCopy(`http://localhost:3000${id}/in-progress`);
    setCopy(true);
  }

  return (
    <div>
      <button
        type="button"
        data-testid="share-btn"
        onClick={ handleShare }
      >
        <img
          src={ shareIcon }
          alt="share-button"
        />
      </button>
      <button
        type="button"
        data-testid="favorite-btn"
        // onClick={ () => handleFavorite(recipe[where][0], where) }
      >
        <img
          src={ whiteHeartIcon }
          alt="favorite-button"
        />
      </button>
      { copy ? <p>Link copied!</p> : '' }
      {
        recipeInfo && (
          <div>
            <div>
              <h2
                data-testid="recipe-title"
              >
                { foodType ? recipeInfo.strMeal : recipeInfo.strDrink }
              </h2>
              <img
                src={ foodType ? recipeInfo.strMealThumb : recipeInfo.strDrinkThumb }
                alt={ foodType ? recipeInfo.idMeal : recipeInfo.idDrink }
                width="180px"
                data-testid="recipe-photo"
              />
              <p data-testid="recipe-category">
                { recipeInfo.strCategory }
              </p>
              <p data-testid="instructions">
                { recipeInfo.strInstructions }
              </p>
            </div>
            <div>
              {
                checked && checked.map((item, index) => (
                  <label
                    key={ index }
                    htmlFor="ingredient"
                    data-testid={ `${index}-ingredient-step` }
                  >
                    <input
                      type="checkbox"
                      checked={ item.checked }
                    />
                    { `${item.measure} ${item.ingredient}` }
                  </label>
                ))
              }
            </div>
          </div>
        )
      }
      <button
        type="button"
        data-testid="finish-recipe-btn"
        style={ {
          position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
        } }
        // onClick={ () => setRedirect(true) }
      >
        Finish Recipe
      </button>
    </div>
  );
}

RecipeInProgress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    url: PropTypes.string,
  }),
}.isRequired;

export default RecipeInProgress;
