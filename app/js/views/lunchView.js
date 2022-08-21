import mealView from "./mealView.js";

class lunchView extends mealView{

    isAdding = false;
    meal = 'lunch';
    _parentElement = document.querySelector('.lunch__screen');
    _closeBtn = this._parentElement.querySelector('.grip__icon-container');
    _addBtn = this._parentElement.querySelector('.add__food-btn');
    _searchScreen = this._parentElement.querySelector('.add__food-screen');
    _searchForm = this._parentElement.querySelector('.searchbar__container');
    _searchInput = this._parentElement.querySelector('.searchbar');
    _loader = this._parentElement.querySelector('.loader');

    constructor(){
        super();
        this._addHandlerCloseBtn();
        this._addHandlerAddbtn();
    }
}

export default new lunchView();