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
  const dom = {
    screenBottom: '.calc__screen--bottom',
    screenTop: '.calc__screen--top',
    allBtn: '.calc__btn',
    clearBtn: '.btn__clear',
  };

  return {
    dom,
    renderInput: (arr) => {
      document.querySelector(dom.screenTop).textContent = arr.join(' ');
    },

    renderTotal: (total) => {
      document.querySelector(dom.screenBottom).textContent = total;
    },

    clearDisplay: () => {
      document.querySelector(dom.screenTop).textContent = '';
      document.querySelector(dom.screenBottom).textContent = '0';
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
      if (value === '=' || value === 'C' || value === 'DEL') {
        return;
      } else if (value === 'x') {
        data.allItems.push('*');
      } else {
        data.allItems.push(value);
      }
    },

    returnData: () => {
      return data.allItems;
    },

    execute: () => {
      const dataStr = Function(`"use strict"; return ${data.allItems.join('')}`)();
      data.total = dataStr;
    },

    returnTotal: () => {
      let total = data.total;

      if (!Number.isInteger(total)) {
        [int, float] = total.toString().split('.');
        float = float.toString().split('');

        let formattedFloat = [];

        if (float.length > 10) {
          for (let i = 0; i < 10; i++) {
            formattedFloat.push(float[i]);
          }

          total = parseFloat(`${int.toString()}.${formattedFloat.join('')}`);
          return total;
        } else {
          return total;
        }
      }
      return total;
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
    let value, dataArr, total;
    if (e.target.firstElementChild) {
      value = e.target.firstElementChild.textContent;

      if (e.target.firstElementChild.className === 'btn__equal') {
        modelCtrl.execute();

        total = modelCtrl.returnTotal();

        modelCtrl.resetData();
      } else if (e.target.firstElementChild.className === 'btn__clear') {
        modelCtrl.resetData();
        viewCtrl.clearDisplay();
      }
    } else {
      value = e.target.textContent;
      if (e.target.className === 'btn__equal') {
        modelCtrl.execute();
        total = modelCtrl.returnTotal();
        modelCtrl.resetData();
      } else if (e.target.className === 'btn__clear') {
        modelCtrl.resetData();
        viewCtrl.clearDisplay();
      }
    }
    modelCtrl.storeValue(value);
    dataArr = modelCtrl.returnData();
    viewCtrl.renderInput(dataArr);
    viewCtrl.renderTotal(total);
  };

  const init = () => {
    window.addEventListener('load', () => {
      modelCtrl.resetData();
      viewCtrl.clearDisplay();
    });
  };

  init();

  // Event Listener
  allBtnArr.forEach((arr) => arr.addEventListener('click', calculate));
  //allBtnArr.forEach((arr) => arr.addEventListener('click', (e) => console.log(e.target.firstElementChild.textContent)));
})(viewController, modelController);
