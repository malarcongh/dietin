import mealView from "./mealView.js";

class snacksView extends mealView{

    isAdding = false;
    meal = 'snacks';
    _parentElement = document.querySelector('.snacks__screen');
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

export default new snacksView();