class homeView{

    DASHARRAY_MEAL_ITEM = 382;
    DASHARRAY_MACROS_CHARTS = 37.33000183105469;
    DASHARRAY_MAIN_CHART = 791.4346313476562;

    _parentElement = document.querySelector('.home__container');
    _todayBtn = document.querySelector('.today__menu');
    _progressBtn = document.querySelector('.progress__menu');
    _mainContentBody = document.querySelector('.main__content-body');
    _mainContentMeals = document.querySelector('.main__content-meals');
    _mainContentProgress = document.querySelector('.main__content-progress');
    _mainContentHeader = document.querySelector('.main__content-header');
    _activeIndicator = document.querySelector('.active__indicator');
    _caloriesChart = document.querySelector('.calories__chart');
    _macrosCharts = document.querySelector('.macros__container');

    constructor(){
        this._addHandlerMenuBtn();
        this._initActiveIndicator(this._todayBtn);
        // this.addHandlerDeleteItem();
    }

    addHandlerDeleteItem(handler){
        const thisObj = this;
        this._mainContentMeals.addEventListener('click', function({target}){
            
            if(!target.matches('.fa-trash-alt')) return;

            let item = target.closest('.meal__item');
            const id = item.dataset.id;
            const meal = item.dataset.meal;

            item.addEventListener('transitionend', function(e){
                if(e.propertyName === 'padding-top'){
                    item.parentNode.removeChild(item);
                    item = null;
                    // handler(id, meal);
                }
            })

            thisObj.renderPlaceholderImage();
            item.classList.add('disappear');
            handler(id, meal);
        })
    }

    _addHandlerMenuBtn(){
        const thisObj = this;
        const btns = [this._todayBtn, this._progressBtn]
        btns.forEach((el, ind) =>{
            el.addEventListener('click', function(){
                thisObj._mainContentBody.style.transform = `translateX(${-50 * ind}%)`;

                if(ind === 0){
                    thisObj._mainContentMeals.style.opacity = 1;
                    thisObj._mainContentProgress.style.opacity = 0;
                }

                if(ind === 1){
                    thisObj._mainContentMeals.style.opacity = 0;
                    thisObj._mainContentProgress.style.opacity = 1;
                }

                // let elems = [thisObj._mainContentMeals, thisObj._mainContentProgress];
                // elems[(ind + 1) % 2].style.opacity = 0;
                // elems[ind].style.opacity = 1;
                // console.log(el.getBoundingClientRect());

                thisObj._moveActiveIndicator(el);

                btns.forEach(btn => {
                    btn.classList.remove('menu__active');
                })
                el.classList.add('menu__active');
            })
        });
    }


    _initActiveIndicator(btn){
        this._moveActiveIndicator(btn);
        this._activeIndicator.style.transition = 'transform .3s ease-out';
    }

    _moveActiveIndicator(btn){
        const btnWidth = btn.getBoundingClientRect().width;
        const btnLeft = btn.getBoundingClientRect().left;
        

        const factor = btnWidth / 10;
        const diff = btnLeft - this._activeIndicator.getBoundingClientRect().left;

        let distanceTranstalated = this._activeIndicator.dataset.distanceTranstalated;
        const distanceToTranslate = diff + (distanceTranstalated ? Number(distanceTranstalated) : 0);

        this._activeIndicator.dataset.distanceTranstalated = distanceToTranslate;
        this._activeIndicator.style.transform = ` translateX(${distanceToTranslate}px) scaleX(${factor})`
    }

    renderNewItem(item){

        //<img src="../assets/img/item-images/pic-${Math.round(Math.random() * 11) + 1}.jpg" alt="" class="meal__item-img">
        let percentages = this._getPercentages(item.foodNutrients);
        let lengths = this._getLengths(percentages);
        const markup = `
            <div class="meal__item" data-id=${item.id} data-meal=${item.meal}>
                <div class="meal__item-delete">
                    <i class="fas fa-trash-alt"></i>
                </div>
                <div class="meal__item-img-container" style="background-image: url(../../assets/img/item-images/pic-${Math.floor(Math.random() * 11) + 1}.jpg);">
                    
                </div>
                <h3 class="meal__item-quantity">${item.servingSize}<span class="meal__item-unit">${item.servingUnit}</span></h3>
                <h3 class="meal__item-hour">${item.time}</h3>
                <p class="meal__item-description">${item.description}, ${item.brand}</p>
                <div class="meal__item-macros-container">
                    <p class="meal__item-protein"><span class="percentage">${percentages.protein}%</span> protein</p>
                    <p class="meal__item-carbs"><span class="percentage">${percentages.carbs}%</span> carbs</p>
                    <p class="meal__item-fats"><span class="percentage">${percentages.fat}%</span> fats</p>
                </div>
                <div class="meal__item-chart">
                    <svg width="395" height="13" viewBox="0 0 395 13">
                        <g id="bg">
                            <line x1="6.5" y1="6.5" x2="388.5" y2="6.5"
                                style="fill:none;stroke:#e8f2f9;stroke-linecap:round;stroke-miterlimit:10;stroke-width:7px" />
                        </g>
                        <g id="fats">
                            <line x1="6.5" y1="6.5" x2="388.5" y2="6.5"
                                style="fill:none;stroke:#F07070;stroke-linecap:round;stroke-miterlimit:10;stroke-width:7px" />
                        </g>
                        <g id="carbs">
                            <line x1="6.5" y1="6.5" x2="388.5" y2="6.5"
                                style="fill:none;stroke:#FFC771;stroke-linecap:round;stroke-miterlimit:10;stroke-width:7px;stroke-dashoffset: ${lengths.carbs};" />
                        </g>
                        <g id="protein">
                            <line x1="6.5" y1="6.5" x2="388.5" y2="6.5"
                                style="fill:none;stroke:#84E1FF;stroke-linecap:round;stroke-miterlimit:10;stroke-width:7px;stroke-dashoffset: ${lengths.protein};" />
                        </g>
                    </svg>
                </div>
            </div>
        `;

        this._mainContentMeals.insertAdjacentHTML('afterbegin', markup);

    }

    renderTotalMacros(data){ 
        const thisObj = this;
        const {targetMacros, totalMacros} = data;
        const percentages = {}, lengths = {};

        Object.entries(targetMacros).forEach(([key, value]) => {
            percentages[key] = Math.round((totalMacros[key] / value * 100) * 100) / 100 ;
        })

        Object.entries(percentages).forEach(([key, value]) => {
            lengths[key] = value > 100 ? 0 : thisObj.DASHARRAY_MACROS_CHARTS - ((thisObj.DASHARRAY_MACROS_CHARTS * value) / 100)
        })

        Object.entries(lengths).forEach(([key, value]) => {
            thisObj._macrosCharts.querySelector(`.macro__${key} #line`).style.strokeDashoffset = value;
        })

        let value = percentages.calories > 100 ? 0 : thisObj.DASHARRAY_MAIN_CHART - ((thisObj.DASHARRAY_MAIN_CHART * percentages.calories) / 100);
        thisObj._caloriesChart.querySelector('.main__chart #path').style.strokeDashoffset = value;
        thisObj._caloriesChart.querySelector('.emoji').innerText = this._getEmoji(totalMacros.calories, targetMacros.calories);
        thisObj._caloriesChart.querySelector('.main__number').innerText = totalMacros.calories.toFixed(0);
        thisObj._caloriesChart.querySelector('h3').innerText = `/${targetMacros.calories}`;

        console.log(targetMacros);
    }

    renderPlaceholderImage(){
        if (this._mainContentMeals.children.length <= 2) this._mainContentMeals.querySelector('.placeholder-img__container').classList.add('active');
    }

    removePlaceholderImage(){
        this._mainContentMeals.querySelector('.placeholder-img__container').classList.remove('active');
    }

    _getEmoji(totalCalories, targetCalories){
        const percentage = totalCalories / targetCalories 
        if(percentage <= 0.2)                      return '🥶';
        if(percentage >  0.2 && percentage <= 0.4) return '😀';
        if(percentage >  0.4 && percentage <= 0.6) return '😎';
        if(percentage >  0.6 && percentage <= 0.8) return '🤩';
        if(percentage >  0.8 && percentage <= 1.1) return '🔥';
        if(percentage > 1.1)                       return '💩';
    }

    _removeItemFromDOM(item){
        item.parentNode.removeChild(item);
    }

    _getPercentages(nutrients){
        let total = nutrients.fat + nutrients.protein + nutrients.carbs;

        return total !== 0 ? {
            carbs: Math.round((nutrients.carbs / total * 100) * 10) / 10,
            fat: Math.round((nutrients.fat / total * 100) * 10) / 10,
            protein: Math.round((nutrients.protein / total * 100) * 10) / 10,
        } : {
            carbs: 0,
            fat: 0,
            protein: 0
        };
    }

    _getLengths(percentages, dasharray = 382){
        // const dasharray = 382;
        return {
            carbs: dasharray - (((dasharray * percentages.carbs) / 100) + (dasharray * percentages.protein) / 100),
            protein: dasharray - ((dasharray * percentages.protein) / 100),
        }
    }
    
}

export default new homeView();