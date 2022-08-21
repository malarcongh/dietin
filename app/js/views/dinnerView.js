import mealView from "./mealView.js";

class dinnerView extends mealView{

    isAdding = false;
    meal = 'dinner';
    _parentElement = document.querySelector('.dinner__screen');
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

export default new dinnerView();