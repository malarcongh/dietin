import * as model from './model.js';
import mainView from './views/mainView.js';
import mealsView from './views/mealsView.js';
import homeView from './views/homeView.js';
import breakfastView from './views/breakfastView.js';
import lunchView from './views/lunchView.js';
import snacksView from './views/snacksView.js';
import dinnerView from './views/dinnerView.js';
import userView from './views/userView.js';

const overlay = document.querySelector('.overlay');

const views = {
    breakfast: breakfastView,
    lunch: lunchView,
    snacks: snacksView,
    dinner: dinnerView
}

const controlSearchResults = async function(view){

    view.renderLoader();
    // console.log(view.getQuery())

    // 1) Get search query
    const query = view.getQuery();
    if(!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    view.stopLoader();
    view.renderSearchResults(model.state.search.results);
}

const controlChangeServing = function(item, itemId, servingSize,view){
    const resultObject = model.getResult(itemId);
    model.editMacrosPerServing(resultObject, servingSize);

    view.renderMacros(item, resultObject.edit.macros);
    // view.getMacrosPerServing(resultItem, servingSize);
}

const controlAddItem = function(item, itemId, isActive,view){
    homeView.removePlaceholderImage();
    view.removePlaceholderImage();

    const resultObject = model.getResult(itemId);

    model.addFood(resultObject, isActive, view.meal);

    const meal = model.state.userData.meals[view.meal];

    view.renderNewItem(meal[meal.length - 1]);
    view.renderTotalMacros(meal);
    homeView.renderNewItem(meal[meal.length - 1])
    homeView.renderTotalMacros(model.state.userData);
}

const controlRemoveItem = function(id, meal){
    model.removeItem(id, meal);
    homeView.renderTotalMacros(model.state.userData);
    views[meal].removeItem(id);
}

const controlOpenEdit = function(item, itemId, view){
    const resultObject = model.getResult(itemId);
    model.resetEdit(resultObject);
    view.renderMacros(item, resultObject.foodNutrients);
}

const controlSaveInfo = function(personalInfo, targetInfo, recommend){

    model.state.userData.personalInfo = {...personalInfo};
    model.state.userData.targetInfo = {...targetInfo}
    model.state.userData.preferences.recommend = recommend;

    
    // console.log(model.state.userData);
    model.updateTargetMacros();
    userView.renderInput(model.state.userData.personalInfo, model.state.userData.targetInfo);
    homeView.renderTotalMacros(model.state.userData);

    mainView.toggleActiveUserMenu();
}

const controlChangeView = function(){
  Object.values(views).forEach(View => {
    View.resetView();
  });
}


function init(){
    Object.values(views).forEach(View => {
        View.addHandlerSearch(controlSearchResults)
        View.addHandlerUpdateServingSize(controlChangeServing);
        View._addHandlerResultItem(controlAddItem, controlOpenEdit);
    });
    homeView.addHandlerDeleteItem(controlRemoveItem);
    userView.addHandlerSave(controlSaveInfo);
    mainView.addHandlerFooterButtons(controlChangeView);
    mealsView.addHandlerEndTransition(controlChangeView);
    
    overlay.addEventListener('animationend', function(){
      this.remove();
    })
    
    window.addEventListener('resize', function(){
      scaleElement(mainView._parentElement);
    })

    scaleElement(mainView._parentElement);
}



init();







function scaleElement(el){

  const curWidth = el.offsetWidth;
  const curHeight = el.offsetHeight;
  let multFactor = Math.min(((vh() * 0.9) / curHeight), ((vw() * 0.9) / curWidth));
  if(multFactor > 1) multFactor = 1;
  el.style.transform = `scale(${multFactor})`
  return multFactor;
}

function vh() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function vw() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}



