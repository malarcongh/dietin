class mealsView{

    _parentElement = document.querySelector('.meals__menu-container');
    _mealBtns = document.querySelectorAll('.meal');
    _isTransitioning = false;
    
    constructor(){
      this._addHandlerMealBtns();
      this._addHandlerStartTransition();
    } 

    _addHandlerMealBtns(){
      const thisObj = this;
      this._mealBtns.forEach(el => {
          el.addEventListener('click', function(){
              if(thisObj._isTransitioning) return;
              const meal = el.dataset.meal;
              const screen = document.querySelector(`.${meal}__screen`);
              screen.classList.add('meal__screen-visible');
          })
      })
    }

    _addHandlerStartTransition(){
      const thisObj = this;
      this._parentElement.addEventListener('transitionstart', function(e){
        if(e.target !== this) return;
        thisObj._isTransitioning = true;
      })
    }

    addHandlerEndTransition(handler){
      const thisObj = this;
      this._parentElement.addEventListener('transitionend', function(e){
        if(e.target !== this || e.propertyName !== 'transform') return;
        handler();
        thisObj._isTransitioning = false;
      })
    }

    // resetView(){
    //   document.querySelectorAll('.meal__screen').forEach(screen => {
    //     screen.resetScreen();
    //   })
    // }

}

export default new mealsView();