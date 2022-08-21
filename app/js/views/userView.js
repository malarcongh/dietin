class userView{

    _parentElement = document.querySelector('.user__info-container');
    _saveButton = document.querySelector('.save__info-btn');

    constructor(){
        this.addHandlerToggleRecommend();
        // console.log('hello');
    }

    addHandlerSave(handler){

        

        this._saveButton.addEventListener('click', function(e){
            const personalInfo = {
                userName : document.querySelector('#user__name').value || document.querySelector('#user__name').placeholder,
                age: Number(document.querySelector('#user__age').value) || Number(document.querySelector('#user__age').placeholder),
                height: Number(document.querySelector('#user__height').value) || Number(document.querySelector('#user__height').placeholder) ,
                currWeight: Number(document.querySelector('#current__weight').value) || Number(document.querySelector('#current__weight').placeholder)
            }

            const targetInfo = {
                dietType: document.querySelector('#diet__type').value || 'Classic',
                targetWeight: Number(document.querySelector('#target__weight').value) || Number(document.querySelector('#target__weight').placeholder),
                targetCalories: Number(document.querySelector('#target__calories').value) || Number(document.querySelector('#target__calories').placeholder),
            }

            console.log(targetInfo);

            const recommend = document.querySelector('#calorie__recommendation').checked;
            console.log(personalInfo);
            console.log(targetInfo);

            handler(personalInfo, targetInfo, recommend);
        })
    }

    renderInput(personalInfo, targetInfo){

        // Personal info
        document.querySelector('#user__name').value = '';
        document.querySelector('#user__name').placeholder = personalInfo.userName;

        document.querySelector('#user__age').value = '';
        document.querySelector('#user__age').placeholder = personalInfo.age;

        document.querySelector('#user__height').value = '';
        document.querySelector('#user__height').placeholder = personalInfo.height;

        document.querySelector('#current__weight').value = '';
        document.querySelector('#current__weight').placeholder = personalInfo.currWeight;


        // Target Info
        document.querySelector('#diet__type').value = targetInfo.dietType;

        document.querySelector('#target__weight').value = ''
        document.querySelector('#target__weight').placeholder = targetInfo.targetWeight;

        document.querySelector('#target__calories').value = ''
        document.querySelector('#target__calories').placeholder = targetInfo.targetCalories;

    }

    addHandlerToggleRecommend(handler){
        document.querySelector('#calorie__recommendation').addEventListener('change', function(){
            document.querySelector('#target__calories').disabled = this.checked;
        })
    }
}

export default new userView();