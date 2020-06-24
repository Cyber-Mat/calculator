/*
1. Set up 3 modules
 a. Model
 b. View
 c. Controller
*/

/************************************************************
 VIEW MODULE
*************************************************************/

const viewController = (() => {
  return {
    dom: {
      screenBottom: '.calc__screen--bottom',
      screenTop: '.calc__screen--top',
      allBtn: '.calc__btn',
      clearBtn: '.btn__clear',
    },
  };
})();

/************************************************************
 MODEL MODULE
*************************************************************/

const modelController = (() => {
  const data = {
    allItems: [],
    total: 0,
  };

  return {
    storeValue: (value) => {
      if (value === '=') {
        return;
      } else if (value === 'x') {
        data.allItems.push('*');
      } else {
        data.allItems.push(value);
      }
    },

    execute: () => {
      const dataStr = eval(data.allItems.join(''));
      console.log(dataStr);
    },
    resetData: () => {
      data.allItems = [];
      //console.log(data.allItems);
      return data.allItems;
    },
    test: () => data.allItems,
  };
})();

/************************************************************
 CONTROLLER MODULE  
*************************************************************/

const appController = ((viewCtrl, modelCtrl) => {
  const dom = viewCtrl.dom;
  const allBtnArr = Array.from(document.querySelectorAll(dom.allBtn));

  // Calculate Function
  const calculate = (e) => {
    let value;
    if (e.target.firstElementChild) {
      value = e.target.firstElementChild.textContent;

      if (e.target.firstElementChild.className === 'btn__equal') {
        modelCtrl.execute();
        modelCtrl.resetData();
      }
    } else {
      value = e.target.textContent;
      if (e.target.className === 'btn__equal') {
        modelCtrl.execute();
        modelCtrl.resetData();
      }
    }
    modelCtrl.storeValue(value);
  };

  // Event Listener
  allBtnArr.forEach((arr) => arr.addEventListener('click', calculate));
  //allBtnArr.forEach((arr) => arr.addEventListener('click', (e) => console.log(e.target.firstElementChild.textContent)));
})(viewController, modelController);
