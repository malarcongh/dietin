class mainView{

    _parentElement = document.querySelector('.main__app-container');
    _menuBtn = document.querySelector('.menu__button-container');
    _infoWindow = document.querySelector('.user__info-container');

    // Navigation Buttons
    _homeBtn = document.querySelector('.home__button');
    _mealsBtn = document.querySelector('.meals__button');
    _goalsBtn = document.querySelector('.goals__button');
    _infoBtn = document.querySelector('.tips__button');
    _footerBtns = [this._homeBtn, this._mealsBtn, this._goalsBtn, this._infoBtn];
    _prevActiveIndex;

    // Screens
    _homeScreen = document.querySelector('.home__container');
    _mealsScreen = document.querySelector('.meals__menu-container');
    _goalsScreen = document.querySelector('.goals__container');
    _infoScreen = document.querySelector('.tips__container');
    _screens = [this._homeScreen, this._mealsScreen, this._goalsScreen, this._infoScreen];

    //Transition boolean
    _isTransitioning = false;

    constructor(){
        this._addHandlerMenuButton();
        this._initScreens();
        // this.addHandlerFooterButtons();
    }

    _addHandlerMenuButton(){
        let thisObj = this;
        this._menuBtn.addEventListener('click',  function(){
            thisObj.toggleActiveUserMenu();
        })
    }

    toggleActiveUserMenu(){
      this._infoWindow.classList.toggle('active');
      this._menuBtn.classList.toggle('active');
    }

    addHandlerFooterButtons(handler){
        let thisObj = this;
        this._footerBtns.forEach((el, i)=> {
            el.addEventListener('click', function(){

                if(thisObj._isTransitioning) return;

                setTimeout(function(){
                  thisObj._isTransitioning = false;
                }, 310)

                thisObj._screens.forEach((el, ind) => {
                    if(ind === i){
                        el.classList.add('transition-active');
                        el.style.transform = `translateX(0)`;
                        el.style.opacity = 1;
                    }
                    else if(ind === thisObj._prevActiveIndex){
                        el.classList.add('transition-active');
                        el.style.transform = `translateX(${ind < i ? '-100%': '100%'})`;
                        el.style.opacity = 0;
                    }
                    else{
                        el.style.transform = `translateX(${ind < i ? '-100%': '100%'})`;
                        el.style.opacity = 0;
                    }
                })
                thisObj._isTransitioning = true;
                thisObj._footerBtns.forEach(btn => btn.classList.remove('footer__button-active'));
                el.classList.add('footer__button-active');
                thisObj._prevActiveIndex = i;
            })
        })
    }

    _initScreens(){
        this._screens.forEach((el, ind) => {
            if(ind !== 0) el.style.transform = 'translateX(100%)';
        })
    }


}

export default new mainView();